"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Share2, Star } from "lucide-react";
import type { Phrase } from "@/types/phrase";
import { SpeakButton } from "./SpeakButton";
import { copyToClipboard } from "@/utils/text";
import { useLanguage } from "@/i18n/LanguageProvider";
import { isFavourite, toggleFavourite } from "@/utils/favourites";
import { pushRecent } from "@/utils/recentPhrases";

/**
 * Communication card — the heart of the app.
 *
 * Shows BOTH English and Filipino simultaneously so the Deaf user can point
 * to the card and a hearing person can read it regardless of their language.
 * Large text is the interface; chrome is minimal.
 */
export function CommunicationCard({ phrase }: { phrase: Phrase }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(() => isFavourite(phrase.id));

  // Register this phrase as recently viewed.
  useEffect(() => {
    pushRecent(phrase.id);
  }, [phrase.id]);

  // The "active" language text is what SpeakButton speaks.
  const activeText = language === "fil" ? phrase.textFil : phrase.text;

  const handleCopy = async () => {
    // Copy both languages so the recipient gets the full context.
    const both = `${phrase.text}\n${phrase.textFil}`;
    const ok = await copyToClipboard(both);
    if (ok) {
      navigator.vibrate?.([40]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareText = `${phrase.text}\n${phrase.textFil}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled or share sheet unavailable — fall back to copy.
        await handleCopy();
      }
    } else {
      await handleCopy();
    }
  };

  const handleStar = () => {
    const nowFav = toggleFavourite(phrase.id);
    setStarred(nowFav);
    navigator.vibrate?.([30]);
  };

  return (
    <section aria-labelledby="comm-text" className="flex flex-col gap-6 page-enter">
      {/* Top bar: back + star */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex min-h-12 w-fit items-center gap-2 rounded-button px-3 text-base font-bold text-text-muted transition-colors hover:bg-surface-alt"
        >
          <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          {t("common.back")}
        </button>
        <button
          type="button"
          onClick={handleStar}
          aria-label={starred ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={starred}
          className="flex h-12 w-12 items-center justify-center rounded-pill transition-colors hover:bg-surface-alt"
        >
          <Star
            aria-hidden="true"
            className={`h-6 w-6 transition-colors ${starred ? "fill-bee-yellow text-bee-yellow" : "text-text-muted"}`}
          />
        </button>
      </div>

      {/* Main card — BOTH languages always visible */}
      <div className="flex min-h-[38dvh] flex-col items-center justify-center gap-4 rounded-card bg-surface p-8 shadow-[var(--shadow)]">
        {/* English */}
        <p
          id="comm-text"
          className="text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl"
        >
          {phrase.text}
        </p>

        {/* Divider */}
        <div className="h-px w-16 rounded-full bg-border" aria-hidden="true" />

        {/* Filipino */}
        <p className="text-center text-2xl font-bold leading-snug text-text-muted sm:text-3xl">
          {phrase.textFil}
        </p>
      </div>

      {/* FSL visual placeholder */}
      {!phrase.fslVisualUrl && (
        <div className="hex-pattern flex h-20 items-center justify-center rounded-card border border-dashed border-border text-sm font-semibold text-text-muted">
          {t("comm.fslPlaceholder")}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <SpeakButton text={activeText} className="flex-1" />

        <button
          type="button"
          onClick={handleShare}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-button border-2 border-bee-black bg-surface px-6 text-lg font-bold transition-colors hover:bg-surface-alt"
          aria-label="Share or copy this phrase"
        >
          {copied ? (
            <Check aria-hidden="true" className="h-5 w-5" />
          ) : navigator.share ? (
            <Share2 aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Copy aria-hidden="true" className="h-5 w-5" />
          )}
          {copied ? t("common.copied") : navigator.share ? "Share" : t("common.copy")}
        </button>
      </div>
    </section>
  );
}
