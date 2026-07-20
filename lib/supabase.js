import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        global: {
          fetch: (input, init) =>
            fetch(input, { ...init, cache: "no-store" }),
        },
      })
    : null;

export async function getPlacesWithHappyHours() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("places")
    .select(
      "id, name, slug, neighborhood, address, website_url, menu_url, reservation_url, description, image_url, happy_hours ( days, start_time, end_time, deals )"
    )
    .eq("status", "approved")
    .order("neighborhood", { ascending: true })
    .order("name", { ascending: true });
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

export async function getUserReviews() {
  if (!supabase) return null;
  const base =
    "id, whiskey_name, bar_text, rating, rating_vibe, rating_menu, body, menu_photo_url, created_at, places ( name, slug, neighborhood ), profiles ( display_name, handle, avatar_url )";
  // video_url is a late addition — retry without it if the column isn't
  // there yet, so the feed never blanks on a half-applied migration.
  let { data, error } = await supabase
    .from("user_reviews")
    .select(`${base}, video_url`)
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error)
    ({ data, error } = await supabase
      .from("user_reviews")
      .select(base)
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(50));
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

// ---- Unified social feed (Gabby + community, one stream) ----

function normalizeGabby(r) {
  return {
    kind: "gabby",
    id: r.id,
    ts: r.posted_at,
    whiskey: r.whiskey_name,
    venue: r.places?.name ?? r.bar_text ?? null,
    neighborhood: r.places?.neighborhood ?? null,
    byline: "Gabby",
    bylineHref: null,
    avatarUrl: "/logo-gabbys.png",
    mediaType: r.video_url ? "video" : r.menu_photo_url ? "image" : null,
    mediaUrl: r.video_url || r.menu_photo_url || null,
    rating: Number(r.rating),
    ratingOutOf: 10,
    vibe: r.rating_vibe != null ? Number(r.rating_vibe) : null,
    menu: r.rating_menu != null ? Number(r.rating_menu) : null,
    notes: r.notes,
    cheers: 0,
    comments: 0,
  };
}

function normalizeCommunity(r) {
  return {
    kind: "community",
    id: r.id,
    ts: r.created_at,
    whiskey: r.whiskey_name,
    venue: r.places?.name ?? r.bar_text ?? null,
    neighborhood: r.places?.neighborhood ?? null,
    byline: r.profiles?.handle
      ? `@${r.profiles.handle}`
      : r.profiles?.display_name || "Anonymous",
    bylineHref: r.profiles?.handle ? `/u/${r.profiles.handle}` : null,
    avatarUrl: r.profiles?.avatar_url || null,
    mediaType: r.video_url ? "video" : r.menu_photo_url ? "image" : null,
    mediaUrl: r.video_url || r.menu_photo_url || null,
    rating: Number(r.rating),
    ratingOutOf: 5,
    vibe: r.rating_vibe != null ? Number(r.rating_vibe) : null,
    menu: r.rating_menu != null ? Number(r.rating_menu) : null,
    notes: r.body,
    cheers: 0,
    comments: 0,
  };
}

async function attachSocialCounts(items) {
  if (!supabase || items.length === 0) return items;
  const ids = items.map((i) => i.id);
  const [{ data: cheerRows }, { data: commentRows }] = await Promise.all([
    supabase.from("cheers").select("review_kind, review_id").in("review_id", ids),
    supabase
      .from("comments")
      .select("review_kind, review_id")
      .eq("status", "live")
      .in("review_id", ids),
  ]);
  const key = (k, id) => `${k}:${id}`;
  const cheerMap = {};
  for (const c of cheerRows || [])
    cheerMap[key(c.review_kind, c.review_id)] =
      (cheerMap[key(c.review_kind, c.review_id)] || 0) + 1;
  const commentMap = {};
  for (const c of commentRows || [])
    commentMap[key(c.review_kind, c.review_id)] =
      (commentMap[key(c.review_kind, c.review_id)] || 0) + 1;
  for (const i of items) {
    i.cheers = cheerMap[key(i.kind, i.id)] || 0;
    i.comments = commentMap[key(i.kind, i.id)] || 0;
  }
  return items;
}

export async function getUnifiedFeed() {
  if (!supabase) return null;
  const [gabby, community] = await Promise.all([
    getGabbysReviews(),
    getUserReviews(),
  ]);
  const items = [
    ...(gabby || []).map(normalizeGabby),
    ...(community || []).map(normalizeCommunity),
  ].sort((a, b) => new Date(b.ts) - new Date(a.ts));
  return attachSocialCounts(items);
}

export async function getSingleReview(kind, id) {
  if (!supabase) return null;
  if (!/^[0-9a-f-]{36}$/.test(String(id))) return null;
  if (kind === "gabby") {
    const { data, error } = await supabase
      .from("gabbys_reviews")
      .select(
        "id, whiskey_name, bar_text, rating, rating_vibe, rating_menu, notes, video_url, menu_photo_url, posted_at, places ( name, slug, neighborhood )"
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    const [item] = await attachSocialCounts([normalizeGabby(data)]);
    return item;
  }
  if (kind === "community") {
    const { data, error } = await supabase
      .from("user_reviews")
      .select(
        "id, whiskey_name, bar_text, rating, rating_vibe, rating_menu, body, menu_photo_url, created_at, places ( name, slug, neighborhood ), profiles ( display_name, handle, avatar_url )"
      )
      .eq("id", id)
      .eq("status", "live")
      .maybeSingle();
    if (error || !data) return null;
    const [item] = await attachSocialCounts([normalizeCommunity(data)]);
    return item;
  }
  return null;
}

export async function getProfileByHandle(handle) {
  if (!supabase) return null;
  const clean = String(handle || "").toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(clean)) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, handle, avatar_url, bio, created_at")
    .eq("handle", clean)
    .maybeSingle();
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

export async function getReviewsByProfile(profileId) {
  if (!supabase) return null;
  const base =
    "id, whiskey_name, bar_text, rating, rating_vibe, rating_menu, body, menu_photo_url, created_at, places ( name, slug, neighborhood )";
  let { data, error } = await supabase
    .from("user_reviews")
    .select(`${base}, video_url`)
    .eq("user_id", profileId)
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error)
    ({ data, error } = await supabase
      .from("user_reviews")
      .select(base)
      .eq("user_id", profileId)
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(100));
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

export async function getGabbysReviews() {
  if (!supabase) return null;
  const sel =
    "id, whiskey_name, bar_text, rating, rating_vibe, rating_menu, notes, video_url, menu_photo_url, posted_at, places ( name, slug, neighborhood )";
  // hidden is a late addition — retry unfiltered if the column isn't there.
  let { data, error } = await supabase
    .from("gabbys_reviews")
    .select(sel)
    .eq("hidden", false)
    .order("posted_at", { ascending: false });
  if (error)
    ({ data, error } = await supabase
      .from("gabbys_reviews")
      .select(sel)
      .order("posted_at", { ascending: false }));
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}
