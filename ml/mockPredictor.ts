import { labels, phraseForLabel } from "@/ml/labels";
import type { Prediction } from "@/types/prediction";
import type { Language } from "@/i18n/translations";
import { clampConfidence } from "@/utils/confidence";

/**
 * Demo-only predictor. Returns a random label with a plausible confidence and
 * a phrase in the requested language. This is replaced by MediaPipe + TF.js in
 * the real pipeline (see mediapipeHands.ts and tfjsPredictor.ts).
 */
export function predictMock(language: Language = "en"): Prediction {
  const label = labels[Math.floor(Math.random() * labels.length)];
  // Bias toward higher confidence so the demo feels convincing.
  const confidence = clampConfidence(0.6 + Math.random() * 0.39);
  return {
    label,
    phrase: phraseForLabel(label, language),
    confidence,
  };
}
