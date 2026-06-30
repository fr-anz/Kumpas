import type { Prediction } from "@/types/prediction";
import type { HandLandmarks } from "@/ml/mediapipeHands";

/**
 * Placeholder for future TensorFlow.js sign prediction.
 *
 * Real pipeline (future):
 *   1. Load the exported model from public/models/sign-model/.
 *   2. Feed the landmark sequence from MediaPipe (mediapipeHands.ts).
 *   3. Run inference and map the top label to a phrase (labels.ts).
 *
 * INTEGRATION POINT: load the model once and run inference per sequence.
 */

const MODEL_URL = "/models/sign-model/model.json";

export async function loadSignModel(): Promise<void> {
  // INTEGRATION POINT: tf.loadLayersModel(MODEL_URL)
  void MODEL_URL;
}

export async function predictFromLandmarks(
  _sequence: HandLandmarks[],
): Promise<Prediction | null> {
  // INTEGRATION POINT: run inference and return the top prediction.
  return null;
}
