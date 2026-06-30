// ── Mock sign predictor ───────────────────────────────────
// Simulates the full MediaPipe + TensorFlow.js inference pipeline.
// Replace this with tfjsPredictor.ts once the model is exported.
//
// TODO (TFjs integration):
//   1. Run `training/scripts/export_tfjs.py` to produce public/models/sign-model/
//   2. Install: npm install @tensorflow/tfjs @mediapipe/tasks-vision
//   3. Load model:  const model = await tf.loadLayersModel('/models/sign-model/model.json')
//   4. Run MediaPipe on each camera frame, collect 40 frames, normalize landmarks
//      using the same transform as extract_landmarks.py (wrist-relative, palm-scaled)
//   5. Feed shape (1, 40, 128) tensor to model.predict()
//   6. Return the argmax label and confidence

import type { Prediction } from '../types/prediction';
import { LABEL_TO_PHRASE, MODEL_LABELS } from './labels';

export async function mockPredict(captureMs = 4000): Promise<Prediction> {
  // Simulate the 4-second capture + ~1s processing the webcam_test.py uses
  await new Promise(r => setTimeout(r, captureMs + 800 + Math.random() * 400));
  const label = MODEL_LABELS[Math.floor(Math.random() * MODEL_LABELS.length)];
  return {
    label,
    phrase: LABEL_TO_PHRASE[label],
    confidence: 0.80 + Math.random() * 0.19,
  };
}
