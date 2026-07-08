/**
 * Gemini-powered message simplification.
 *
 * Used by Hearing Person Mode when the device is online and a Gemini API key
 * is configured. Falls back gracefully to the local rule-based simplifier
 * (simplifierService.ts) when offline or unconfigured — core features never
 * require this service.
 *
 * Key: NEXT_PUBLIC_GEMINI_API_KEY in .env
 * Model: gemini-2.0-flash (fast, low-latency for short prompts)
 */

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/** Whether a Gemini key is configured. */
export const isGeminiConfigured: boolean = API_KEY.length > 0;

/**
 * Simplify a staff/government message into plain language for a Deaf person.
 * Returns the simplified text on success.
 * Throws on network error or API failure so the caller can fall back.
 */
export async function simplifyWithGemini(
  input: string,
  language: "en" | "fil" = "en",
): Promise<{ simplified: string; responses: string[] }> {
  if (!isGeminiConfigured) {
    throw new Error("Gemini API key is not configured.");
  }
  if (!input.trim()) {
    throw new Error("Empty input.");
  }

  const langLabel = language === "fil" ? "Filipino (Tagalog)" : "English";

  const prompt = `You are helping a Deaf Filipino person communicate in a public service situation.
A staff member has typed this message: "${input.trim()}"

Do two things:
1. Rewrite it in short, plain ${langLabel} that is easy to understand.
2. Provide 3 short, natural ${langLabel} responses that the Deaf person could tap to reply to this message.

Output ONLY valid JSON in this format:
{
  "simplified": "string",
  "responses": ["string", "string", "string"]
}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 200,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    const parsed = JSON.parse(text);
    return {
      simplified: parsed.simplified || "",
      responses: Array.isArray(parsed.responses) ? parsed.responses : [],
    };
  } catch (e) {
    throw new Error("Failed to parse Gemini JSON output.");
  }
}
