import { hasSupabase, supabase } from "../lib/supabase";

export type AiInsightRequest = {
  topLocation?: {
    name: string;
    state: string;
    score: number;
    level: string;
  };
  criticalCount?: number;
  activeAlertCount?: number;
  prompt?: string;
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function saveAiInsightToSupabase(
  request: AiInsightRequest,
  response: string
) {
  if (!hasSupabase || !supabase) {
    return;
  }

  try {
    const { error } = await supabase.from("ai_insights").insert({
      prompt: request.prompt ?? "Summarize the current risk.",
      response,
      location_name: request.topLocation?.name ?? null,
      score: request.topLocation?.score ?? null,
      level: request.topLocation?.level ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("AI insight sync failed:", error.message);
    }
  } catch (error) {
    console.error("AI insight sync failed:", error);
  }
}

export async function getAiInsight(request: AiInsightRequest) {
  const fallbackMessage = buildLocalInsight(request);

  if (!GEMINI_API_KEY) {
    return fallbackMessage;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a landslide monitoring AI assistant. Provide a concise operational answer in 2 sentences. Use these facts: highest risk location=${request.topLocation?.name ?? "N/A"} in ${request.topLocation?.state ?? "N/A"}, score=${request.topLocation?.score ?? 0}, level=${request.topLocation?.level ?? "N/A"}, critical sites=${request.criticalCount ?? 0}, active alerts=${request.activeAlertCount ?? 0}. The user asks: ${request.prompt ?? "Summarize the current risk."}. Prioritize clear actions and mention which areas need immediate attention.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return fallbackMessage;
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? fallbackMessage;

    return text.trim() || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

function buildLocalInsight(request: AiInsightRequest) {
  const location = request.topLocation;
  const criticalCount = request.criticalCount ?? 0;
  const activeAlertCount = request.activeAlertCount ?? 0;

  if (!location) {
    return "Current monitoring data is stable, but there are no active hotspots yet. Continue routine checks and keep rainfall and slope readings under review.";
  }

  const riskAction =
    location.level === "CRITICAL"
      ? "dispatch field teams immediately and activate a precautionary warning cycle"
      : location.level === "HIGH"
      ? "increase monitoring frequency and prepare a public advisory"
      : "continue routine monitoring with a close watch on rainfall trends";

  const areaText = `${location.name} in ${location.state}`;

  return `${areaText} currently shows the highest landslide risk at ${location.score}/100 and is classified as ${location.level.toLowerCase()} risk. There are ${criticalCount} critical sites and ${activeAlertCount} active alerts, so the recommended action is to ${riskAction}.`;
}
