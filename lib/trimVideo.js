// Client-side video trim + re-encode (Instagram-style clip stage).
// Draws the selected range through a canvas + captureStream into
// MediaRecorder, so no wasm download. Works in Chrome/Edge/Android and
// iOS Safari 16+ (canvas.captureStream + WebAudio element routing).

export function pickMime() {
  const candidates = [
    { mime: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: 'video/webm;codecs="vp9,opus"', ext: "webm" },
    { mime: 'video/webm;codecs="vp8,opus"', ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];
  for (const c of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(c.mime)
    )
      return c;
  }
  return null;
}

export function canTrim() {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof document !== "undefined" &&
    !!document.createElement("canvas").captureStream &&
    !!pickMime()
  );
}

export async function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      const d = v.duration;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(d) ? d : 0);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that video."));
    };
    v.src = url;
  });
}

export async function trimVideo(file, start, end, onProgress) {
  const picked = pickMime();
  if (!picked) throw new Error("This browser can't process video.");
  const { mime, ext } = picked;

  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.playsInline = true;
  video.crossOrigin = "anonymous";
  await new Promise((res, rej) => {
    video.onloadedmetadata = res;
    video.onerror = () => rej(new Error("Couldn't open the video."));
  });

  // Scale down to max 1280 on the long edge — keeps files small.
  const MAX_EDGE = 1280;
  let w = video.videoWidth || 1280;
  let h = video.videoHeight || 720;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  w = Math.round((w * scale) / 2) * 2;
  h = Math.round((h * scale) / 2) * 2;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // Seek BEFORE creating the stream/recorder, and paint the first real frame
  // immediately — otherwise captureStream starts emitting a blank canvas the
  // instant it's created, and that blank lead-in gets baked into the file as
  // a startup gap that isn't there in the (unaffected) wizard preview, which
  // always plays the original file rather than this re-encoded output.
  video.currentTime = Math.max(0, start);
  await new Promise((res) => (video.onseeked = res));
  ctx.drawImage(video, 0, 0, w, h);

  // No fixed frame rate: captureStream() with no argument emits a new frame
  // each time the canvas is actually repainted, so recorded frame timing
  // tracks real elapsed time even if a draw is occasionally late — a fixed
  // captureStream(30) instead assumes a rigid 33ms cadence that drifts out
  // of step with the audio clock under CPU load (very easy to hit on a
  // phone doing decode + draw + encode + WebAudio at once), which is the
  // root cause of audio/video drifting apart, worse the longer the clip.
  const stream = canvas.captureStream();

  // Route the element's audio into the stream (silences speakers too).
  let audioCtx = null;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(video);
    const dest = audioCtx.createMediaStreamDestination();
    src.connect(dest);
    const track = dest.stream.getAudioTracks()[0];
    if (track) stream.addTrack(track);
  } catch {
    // no audio track — proceed silent rather than fail
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 3_500_000,
    audioBitsPerSecond: 128_000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  const done = new Promise((res) => (recorder.onstop = res));

  // Draw driven by requestVideoFrameCallback rather than requestAnimationFrame.
  // rAF fires on the display's paint clock, which is a *different* clock from
  // the one the audio track runs on -- under load (thermal throttling, a
  // backgrounded tab, battery saver) rAF can lag or get skipped while audio
  // keeps playing in real time, which is exactly the residual drift that
  // survived the captureStream(30) fix. requestVideoFrameCallback instead
  // fires once per *actual decoded video frame*, tied to the same underlying
  // media clock the audio track is drawn from, so drawn frames track real
  // playback position much more tightly. Falls back to rAF on browsers that
  // don't support it yet (older Safari).
  const hasRVFC = typeof video.requestVideoFrameCallback === "function";
  let raf;
  let stopped = false;

  const finish = () => {
    if (stopped) return;
    stopped = true;
    video.pause();
    if (recorder.state !== "inactive") recorder.stop();
  };

  const reportProgress = () => {
    if (onProgress && end > start) {
      onProgress(
        Math.min(1, Math.max(0, (video.currentTime - start) / (end - start)))
      );
    }
  };

  const onVideoFrame = (_now, metadata) => {
    if (stopped) return;
    ctx.drawImage(video, 0, 0, w, h);
    reportProgress();
    if ((metadata?.mediaTime ?? video.currentTime) >= end || video.ended) {
      finish();
      return;
    }
    video.requestVideoFrameCallback(onVideoFrame);
  };

  const drawRaf = () => {
    if (stopped) return;
    ctx.drawImage(video, 0, 0, w, h);
    reportProgress();
    if (video.currentTime >= end || video.ended) {
      finish();
      return;
    }
    raf = requestAnimationFrame(drawRaf);
  };

  if (audioCtx && audioCtx.state === "suspended") await audioCtx.resume();

  // Only start the recorder once media is verifiably flowing (the 'playing'
  // event, not just the play() promise resolving a beat earlier) so audio
  // and video both begin from the same real moment — no silent/static
  // lead-in for the recorder to capture before there's anything to record.
  const playing = new Promise((res) => video.addEventListener("playing", res, { once: true }));
  await video.play();
  await playing;
  recorder.start(1000);
  if (hasRVFC) {
    video.requestVideoFrameCallback(onVideoFrame);
  } else {
    drawRaf();
  }

  await done;
  if (raf) cancelAnimationFrame(raf);
  URL.revokeObjectURL(url);
  if (audioCtx) audioCtx.close().catch(() => {});

  const blob = new Blob(chunks, { type: mime.split(";")[0] });
  if (!blob.size) throw new Error("Trim produced an empty file — try again.");
  return { blob, ext, mimeType: mime.split(";")[0] };
}
