"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import type { Phrase } from "@/types/phrase";
import { SpeakButton } from "./SpeakButton";
import { copyToClipboard } from "@/utils/text";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * The communication card is the heart of the app: very large phrase text,
 * readable from a distance, with Speak and Copy actions. The text is the
 * interface — minimal chrome around it.
 */
export function CommunicationCard({ phrase }: { phrase: Phrase }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const text = language === "fil" ? phrase.textFil : phrase.text;

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section aria-labelledby="comm-text" className="flex flex-col gap-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex min-h-12 w-fit items-center gap-2 rounded-button px-3 text-base font-bold text-text-muted transition-colors hover:bg-surface-alt"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5" /> {t("common.back")}
      </button>

      <div className="flex min-h-[40dvh] items-center justify-center rounded-card bg-surface p-6 shadow-[var(--shadow)]">
        <p
          id="comm-text"
          className="text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl"
        >
          {text}
        </p>
      </div>

      {/* Optional FSL visual placeholder area. */}
      {phrase.fslVisualUrl ? null : (
        <div className="hex-pattern flex h-24 items-center justify-center rounded-card border border-dashed border-border text-sm font-semibold text-text-muted">
          {t("comm.fslPlaceholder")}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SpeakButton text={text} className="flex-1" />
        <button
          type="button"
          onClick={handleCopy}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-button border-2 border-bee-black bg-surface px-6 text-lg font-bold transition-colors hover:bg-surface-alt"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Copy aria-hidden="true" className="h-5 w-5" />
          )}
          {copied ? t("common.copied") : t("common.copy")}
        </button>
      </div>
    </section>
  );
}
