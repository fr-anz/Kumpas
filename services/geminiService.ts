/**
 * Placeholder for future online message simplification via Gemini.
 *
 * This is intentionally NOT wired into the core app. Core features must work
 * offline with the local rule-based simplifier (`simplifierService.ts`).
 * When implemented, this should be network-only and fail gracefully offline.
 */

export async function simplifyWithGemini(_input: string): Promise<string> {
  throw new Error(
    "geminiService is a placeholder. Use simplifierService for offline simplification.",
  );
}

export const isGeminiConfigured = false;
