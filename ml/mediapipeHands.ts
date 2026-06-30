/**
 * Placeholder for future MediaPipe Web hand-landmark extraction.
 *
 * Real pipeline (future):
 *   1. Capture a video frame from the camera.
 *   2. Run MediaPipe Hands to detect 21 hand landmarks per hand.
 *   3. Collect a landmark sequence across several frames.
 *   4. Pass the sequence to the TF.js model (tfjsPredictor.ts).
 *
 * INTEGRATION POINT: initialize the MediaPipe Hands solution here and expose
 * a function that turns a video frame into a normalized landmark array.
 */

export type HandLandmarks = number[][];

export async function initHandTracking(): Promise<void> {
  // No-op placeholder. Wire up MediaPipe Hands here.
}

export async function extractLandmarks(
  _frame: unknown,
): Promise<HandLandmarks | null> {
  // INTEGRATION POINT: return detected landmarks for the given frame.
  return null;
}
