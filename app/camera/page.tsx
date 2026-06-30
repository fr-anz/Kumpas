"use client";

import { useEffect, useRef, useState } from "react";
import { CameraPreview } from "@/components/CameraPreview";
import { SpeakButton } from "@/components/SpeakButton";
import { predictMock } from "@/ml/mockPredictor";
import { formatConfidence, confidenceLevel } from "@/utils/confidence";
import type { Prediction } from "@/types/prediction";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Camera recognition demo.
 *
 * MVP uses `predictMock`. The integration points for the real pipeline are:
 *   - mediapipeHands.ts: extract hand landmarks from each video frame
 *   - tfjsPredictor.ts:  run the TF.js model on a landmark sequence
 * Replace the mock interval below with that pipeline when ready.
 */
export default function CameraPage() {
  const { language, t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  // Keep the active language available to the interval callback without
  // re-creating the camera stream when it changes.
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const stopCamera = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  };

  // Clean up the camera when leaving the page.
  useEffect(() => stopCamera, []);

  const startCamera = async () => {
    setError(null);
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError(t("camera.notAvailable"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);

      // Mock predictions on a timer. Real pipeline replaces this block.
      intervalRef.current = window.setInterval(() => {
        setPrediction(predictMock(languageRef.current));
      }, 2000);
      setPrediction(predictMock(languageRef.current));
    } catch {
      setError(t("camera.denied"));
    }
  };

  const confLabel = (value: number) =>
    t(
      `camera.conf${confidenceLevel(value).charAt(0).toUpperCase()}${confidenceLevel(
        value,
      ).slice(1)}`,
    );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black tracking-tight">
          {t("camera.title")}
        </h1>
        <p className="mt-2 text-sm font-semibold text-warn">
          {t("camera.prototypeNote")}
        </p>
      </header>

      <CameraPreview
        ref={videoRef}
        active={active}
        error={error ?? (active ? null : t("camera.cameraOff"))}
      />

      <div className="flex gap-3">
        {!active ? (
          <button
            type="button"
            onClick={startCamera}
            className="flex min-h-12 flex-1 items-center justify-center rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright"
          >
            {t("camera.start")}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="flex min-h-12 flex-1 items-center justify-center rounded-button border-2 border-bee-black bg-surface px-6 text-lg font-bold transition-colors hover:bg-surface-alt"
          >
            {t("camera.stop")}
          </button>
        )}
      </div>

      {prediction && active && (
        <div
          aria-live="polite"
          className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-[var(--shadow)]"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("camera.detectedSign")}
            </p>
            <p className="text-2xl font-black">{prediction.label}</p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm font-bold">
              <span>
                {t("camera.confidence")} ({confLabel(prediction.confidence)})
              </span>
              <span>{formatConfidence(prediction.confidence)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-pill bg-surface-alt">
              <div
                className="h-full rounded-pill bg-bee-yellow transition-[width]"
                style={{ width: formatConfidence(prediction.confidence) }}
              />
            </div>
          </div>

          <div className="rounded-button bg-surface-alt p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("camera.outputPhrase")}
            </p>
            <p className="mt-1 text-xl font-bold">{prediction.phrase}</p>
          </div>

          <SpeakButton text={prediction.phrase} label={t("camera.speakOutput")} />
        </div>
      )}
    </div>
  );
}
