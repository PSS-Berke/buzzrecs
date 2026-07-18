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
  const { data, error } = await supabase
    .from("user_reviews")
    .select(
      "id, whiskey_name, bar_text, rating, body, created_at, places ( name, slug, neighborhood ), profiles ( display_name )"
    )
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}

export async function getGabbysReviews() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("gabbys_reviews")
    .select(
      "id, whiskey_name, bar_text, rating, notes, video_url, posted_at, places ( name, slug, neighborhood )"
    )
    .order("posted_at", { ascending: false });
  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }
  return data;
}
