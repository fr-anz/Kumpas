/** Helpers for presenting prediction confidence to users. */

/** Clamp a raw confidence value into the 0–1 range. */
export function clampConfidence(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** Format a 0–1 confidence as a whole-number percentage string. */
export function formatConfidence(value: number): string {
  return `${Math.round(clampConfidence(value) * 100)}%`;
}

/** A coarse label so users get meaning, not just a number. */
export function confidenceLevel(value: number): "low" | "medium" | "high" {
  const c = clampConfidence(value);
  if (c >= 0.8) return "high";
  if (c >= 0.5) return "medium";
  return "low";
}
