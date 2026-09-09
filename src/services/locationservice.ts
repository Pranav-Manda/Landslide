import { supabase, hasSupabase } from "../lib/supabase";
import { locations as fallbackLocations } from "../data/locations";
import type { Location } from "../data/locations";

export async function fetchLocations() {
  if (!hasSupabase || !supabase) {
    return fallbackLocations;
  }

  const { data, error } = await supabase.from("locations").select("*");

  if (error) {
    console.error("Supabase error:", error);
    return fallbackLocations;
  }

  return data as Location[];
}

export async function syncLocationsToSupabase(locations: Location[]) {
  if (!hasSupabase || !supabase) {
    return;
  }

  try {
    const rows = locations.map((location) => ({
      id: location.id,
      name: location.name,
      state: location.state,
      latitude: location.latitude,
      longitude: location.longitude,
      rainfall: location.rainfall,
      soil_moisture: location.soilMoisture,
      slope: location.slope,
      historical_susceptibility: location.historicalSusceptibility,
      previous_risk: location.previousRisk,
      risk_score: location.risk.score,
      risk_level: location.risk.level,
      roads: location.roads,
      settlements: location.settlements,
      infrastructure: location.infrastructure,
      last_updated: new Date().toISOString(),
    }));

    const { error } = await supabase.from("locations").upsert(rows, {
      onConflict: "id",
    });

    if (error) {
      console.error("Location sync failed:", error.message);
    }
  } catch (error) {
    console.error("Location sync failed:", error);
  }
}