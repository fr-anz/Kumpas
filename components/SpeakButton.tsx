"use client";

import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
import {
  isSpeechSupported,
  speak,
  stopSpeaking,
} from "@/services/speechService";
import { useLanguage } from "@/i18n/LanguageProvider";

type SpeakButtonProps = {
  text: string;
  label?: string;
  className?: string;
};

/**
 * Primary speak control.
 *
 * Uses the SpeechSynthesis `onend` / `onerror` events to track speaking state
 * accurately (instead of a guessed setTimeout). Haptic feedback on tap.
 */
export function SpeakButton({ text, label, className = "" }: SpeakButtonProps) {
  const { t, speechLocale } = useLanguage();
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => stopSpeaking();
  }, []);

  if (!supported) {
    return (
      <p className="rounded-button bg-surface-alt px-4 py-3 text-sm font-semibold text-text-muted">
        {t("speak.notAvailable")}
      </p>
    );
  }

  const handleClick = () => {
    navigator.vibrate?.([50]);

    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    void speak(text, speechLocale, () => setSpeaking(false));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      aria-label={speaking ? t("common.stop") : (label ?? t("common.speak"))}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber ${className}`}
    >
      {speaking ? (
        <Square aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Volume2 aria-hidden="true" className="h-5 w-5" />
      )}
      {speaking ? t("common.stop") : (label ?? t("common.speak"))}
    </button>
  );
}

