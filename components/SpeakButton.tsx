"use client";

import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { isSpeechSupported, speak, stopSpeaking } from "@/services/speechService";
import { useLanguage } from "@/i18n/LanguageProvider";

type SpeakButtonProps = {
  text: string;
  /** Optional custom label key/text; defaults to the localized "Speak". */
  label?: string;
  className?: string;
};

/**
 * Primary speak control. Speaks in the active language's locale, announces
 * start/stop for screen readers, and degrades gracefully when SpeechSynthesis
 * is unavailable.
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
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    void speak(text, speechLocale);
    setSpeaking(true);
    // SpeechSynthesis has no reliable end event across browsers, so we reset
    // the visual state shortly after, based on a rough estimate.
    const estimatedMs = Math.max(1500, text.length * 70);
    window.setTimeout(() => setSpeaking(false), estimatedMs);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
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
