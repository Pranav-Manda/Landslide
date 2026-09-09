import { supabase } from "../lib/supabase";

export async function fetchLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  console.log("Locations from Supabase:", data);

  return data;
}