"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  initHandTracking,
  detectForVideo,
  resultToFeatures,
  disposeHandTracking,
  FEATURE_COUNT,
} from "./mediapipeHands";
import {
  loadSignModel,
  predictFromSequence,
  type SignModel,
} from "./tfjsPredictor";
import { phraseForLabel, isNoSign } from "./labels";
import { drawLandmarks } from "./drawLandmarks";
import { activityMotion, MotionSegmenter } from "./motionSegmenter";
import type { Prediction } from "@/types/prediction";
import type { Language } from "@/i18n/translations";

export type RecognitionStatus =
  "idle" | "loading" | "ready" | "running" | "error";

/** Live, raw top prediction used for "detecting…" feedback. */
export type LivePrediction = { label: string; confidence: number };

type Options = {
  language: Language;
  /** Called when a confident sign is committed (stabilized). */
  onResult?: (prediction: Prediction) => void;
};

// Keep browser segmentation aligned with training/config.json auto_capture.
const MAXIMUM_SIGN_MS = 8000;
const PRE_ROLL_MS = 150;
const POST_ROLL_MS = 150;
const BUFFER_MS = MAXIMUM_SIGN_MS + PRE_ROLL_MS + POST_ROLL_MS + 1000;
const STABILITY_COUNT = 3; // identical top labels needed to commit

type FrameSample = {
  features: Float32Array;
  present: boolean;
  t: number;
};

/**
 * Real-time sign recognition.
 *
 * Per video frame: MediaPipe detects landmarks → 128-D features (matching
 * training) → pushed into a timestamped ring buffer and drawn as an overlay.
 * Motion marks the sign boundaries. The completed segment is resampled with
 * three small boundary variants, and all predictions must agree before a sign
 * is committed.
 */
export function useSignRecognition({ language, onResult }: Options) {
  const [status, setStatus] = useState<RecognitionStatus>("idle");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [live, setLive] = useState<LivePrediction | null>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modelRef = useRef<SignModel | null>(null);
  const framesRef = useRef<FrameSample[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const runningRef = useRef<boolean>(false);
  const processingRef = useRef<boolean>(false);
  const armedRef = useRef<boolean>(true);
  const previousActivityRef = useRef<Float32Array | null>(null);
  const segmenterRef = useRef(
    new MotionSegmenter({
      startThreshold: 0.035,
      stopThreshold: 0.012,
      startFrames: 3,
      endHoldMs: 700,
      minimumSignMs: 800,
      maximumSignMs: MAXIMUM_SIGN_MS,
      smoothing: 0.4,
    }),
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const languageRef = useRef<Language>(language);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // If the language changes while a result is showing, re-localize its phrase.
  useEffect(() => {
    setPrediction((prev) =>
      prev ? { ...prev, phrase: phraseForLabel(prev.label, language) } : prev,
    );
  }, [language]);

  const prepare = useCallback(async () => {
    if (modelRef.current) return;
    setStatus("loading");
    setError(null);
    try {
      const [, model] = await Promise.all([
        initHandTracking(),
        loadSignModel(),
      ]);
      modelRef.current = model;
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Failed to load the model.",
      );
    }
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    framesRef.current = [];
    previousActivityRef.current = null;
    segmenterRef.current.reset();
    processingRef.current = false;
    armedRef.current = true;
    setHandDetected(false);
    setLive(null);
    if (modelRef.current) setStatus("ready");
  }, []);

  /** Resample one detected segment to exactly `length` evenly-spaced frames. */
  const resample = useCallback(
    (
      start: number,
      end: number,
      length: number,
    ): { seq: Float32Array[]; coverage: number } => {
      const frames = framesRef.current;
      const seq: Float32Array[] = [];
      let present = 0;
      for (let i = 0; i < length; i++) {
        const target = start + ((end - start) * i) / (length - 1);
        // Nearest frame by timestamp.
        let best = frames[0];
        let bestDist = Infinity;
        for (const f of frames) {
          const d = Math.abs(f.t - target);
          if (d < bestDist) {
            bestDist = d;
            best = f;
          }
        }
        if (best) {
          seq.push(best.features);
          if (best.present) present++;
        } else {
          seq.push(new Float32Array(FEATURE_COUNT));
        }
      }
      return { seq, coverage: present / length };
    },
    [],
  );

  const runSegmentInference = useCallback(
    async (model: SignModel, start: number, end: number) => {
      if (processingRef.current || end <= start) return;
      processingRef.current = true;
      try {
        const duration = end - start;
        const intervals = [
          [start, end],
          [start + duration * 0.04, end - duration * 0.04],
          [start + duration * 0.08, end - duration * 0.08],
        ];
        const samples = intervals.map(([sampleStart, sampleEnd]) =>
          resample(sampleStart, sampleEnd, model.sequenceLength),
        );
        if (samples.some(({ coverage }) => coverage < model.minHandCoverage)) {
          setLive(null);
          return;
        }

        const results = await Promise.all(
          samples.map(({ seq }) => predictFromSequence(model, seq)),
        );
        if (!runningRef.current) return;

        const first = results[0].prediction;
        setLive(
          isNoSign(first.label)
            ? null
            : { label: first.label, confidence: first.confidence },
        );
        const stable =
          results.length === STABILITY_COUNT &&
          results.every(({ prediction }) => prediction.label === first.label);
        const confident = results.every(({ prediction, probabilities }) => {
          const sorted = [...probabilities].sort((left, right) => right - left);
          return (
            prediction.confidence >= model.confidenceThreshold &&
            sorted[0] - sorted[1] >= model.minTopTwoMargin
          );
        });

        if (!stable || !confident) return;
        if (isNoSign(first.label)) {
          armedRef.current = true;
          return;
        }
        if (!armedRef.current) return;

        armedRef.current = false;
        const phrase = phraseForLabel(first.label, languageRef.current);
        const enriched: Prediction = { ...first, phrase };
        navigator.vibrate?.([100, 50, 100]);
        setPrediction(enriched);
        onResultRef.current?.(enriched);
      } catch {
        // A later completed segment can recover from a transient inference error.
      } finally {
        processingRef.current = false;
      }
    },
    [resample],
  );

  const start = useCallback(
    async (video: HTMLVideoElement, overlay?: HTMLCanvasElement | null) => {
      if (!modelRef.current) await prepare();
      const model = modelRef.current;
      if (!model) return;

      canvasRef.current = overlay ?? null;
      runningRef.current = true;
      setStatus("running");
      lastVideoTimeRef.current = -1;
      framesRef.current = [];
      previousActivityRef.current = null;
      segmenterRef.current.reset();
      processingRef.current = false;
      armedRef.current = true;

      const loop = () => {
        if (!runningRef.current) return;

        if (
          video.readyState >= 2 &&
          video.currentTime !== lastVideoTimeRef.current
        ) {
          lastVideoTimeRef.current = video.currentTime;
          const ts = performance.now();
          const result = detectForVideo(video, ts);

          // Live landmark overlay for immediate visual feedback.
          if (canvasRef.current) {
            drawLandmarks(canvasRef.current, video, result);
          }

          const { features, activity, handPresent } = resultToFeatures(result);
          setHandDetected(handPresent);

          const frames = framesRef.current;
          frames.push({ features, present: handPresent, t: ts });
          const cutoff = ts - BUFFER_MS;
          while (frames.length > 0 && frames[0].t < cutoff) frames.shift();

          const motion = activityMotion(previousActivityRef.current, activity);
          previousActivityRef.current = activity;
          const event = segmenterRef.current.update(motion, handPresent, ts);
          if (
            event.completed &&
            event.startTime !== undefined &&
            event.endTime !== undefined
          ) {
            void runSegmentInference(
              model,
              event.startTime - PRE_ROLL_MS,
              event.endTime + POST_ROLL_MS,
            );
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    },
    [prepare, runSegmentInference],
  );

  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      disposeHandTracking();
    };
  }, []);

  return {
    status,
    prediction,
    live,
    handDetected,
    error,
    prepare,
    start,
    stop,
  };
}
