"use client";

import { useState } from "react";
import { Sparkles, Wifi, WifiOff } from "lucide-react";
import { simplify, suggestPhrases } from "@/services/simplifierService";
import {
  simplifyWithGemini,
  isGeminiConfigured,
} from "@/services/geminiService";
import { findExactPhrase } from "@/data/phrases";
import { loadOnlineAiConsent } from "@/services/storageService";
import { clipMap } from "@/data/clipMap";
import { labelToIdMap } from "@/data/labelToId";
import { SpeakButton } from "@/components/SpeakButton";
import { SignVisual } from "@/components/SignVisual";
import { PhraseCard } from "@/components/PhraseCard";
import type { Phrase } from "@/types/phrase";
import { useLanguage } from "@/i18n/LanguageProvider";

type SimplifySource = "gemini" | "local" | null;

/**
 * Hearing person mode: staff types a message, the app simplifies it.
 *
 * Online + Gemini key configured → uses Gemini 2.0 Flash for higher quality.
 * Offline or no key → falls back to the local rule-based simplifier.
 */
export default function HearingPage() {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [simplified, setSimplified] = useState("");
  const [source, setSource] = useState<SimplifySource>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Phrase[]>([]);
  // Set when the typed message exactly matches a library preset, so we can
  // show that preset's pre-saved FSL visual.
  const [matched, setMatched] = useState<Phrase | null>(null);
  const [matchedClips, setMatchedClips] = useState<string[]>([]);

  const resolveClips = (text: string): string[] => {
    const normalizedText = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    if (!normalizedText) return [];
    
    const labels = Object.keys(labelToIdMap).sort((a, b) => b.length - a.length);
    const matches: { index: number, clip: string }[] = [];
    let remainingText = ` ${normalizedText} `; 
    
    for (const label of labels) {
      const paddedLabel = ` ${label} `;
      const idx = remainingText.indexOf(paddedLabel);
      if (idx !== -1) {
        const id = labelToIdMap[label];
        const folderName = label.toLowerCase().replace(/ /g, '_');
        const clipPath = id ? (clipMap[id] || clipMap[folderName]) : null;
        
        if (clipPath) {
          matches.push({ index: idx, clip: clipPath });
        }
        // Replace with spaces to preserve indices for subsequent matches
        remainingText = remainingText.replace(paddedLabel, ' '.repeat(paddedLabel.length));
      }
    }
    
    matches.sort((a, b) => a.index - b.index);
    return matches.map(m => m.clip);
  };

  const handleSimplify = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setSimplified("");
    setSource(null);
    setMatched(findExactPhrase(trimmed) ?? null);
    setLoading(true);

    // Try Gemini only when online, configured, AND the user has consented to
    // online AI. Without consent the message never leaves the device.
    if (isGeminiConfigured && navigator.onLine && loadOnlineAiConsent()) {
      try {
        const result = await simplifyWithGemini(trimmed, language);
        setSimplified(result);
        setSource("gemini");
        setSuggestions(suggestPhrases(trimmed, language));
        setMatchedClips(resolveClips(result));
        setLoading(false);
        return;
      } catch {
        // Fall through to local simplifier.
      }
    }

    // Offline / unconfigured / Gemini error → local rule-based.
    const localResult = simplify(trimmed, language);
    setSimplified(localResult);
    setSource("local");
    setSuggestions(suggestPhrases(trimmed, language));
    setMatchedClips(resolveClips(localResult));
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 page-enter">
      <header>
        <h1 className="text-3xl font-black tracking-tight">
          {t("hearing.title")}
        </h1>
        <p className="mt-2 text-text-muted">{t("hearing.subtitle")}</p>
      </header>

      <label className="flex flex-col gap-2">
        <span className="font-bold">{t("hearing.yourMessage")}</span>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder={t("hearing.placeholder")}
          className="rounded-card border border-border-lining bg-surface p-4 text-lg shadow-[var(--shadow)]"
        />
      </label>

      <button
        type="button"
        onClick={handleSimplify}
        disabled={!input.trim() || loading}
        className="flex min-h-12 items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border border-border-lining border-t-transparent" />
            Simplifying…
          </>
        ) : (
          t("hearing.simplify")
        )}
      </button>

      {simplified && (
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-bee-yellow bg-surface p-4 shadow-[var(--shadow)]">
            {/* Source badge */}
            <div className="mb-3 flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {t("hearing.simplified")}
              </p>
              {source === "gemini" ? (
                <span className="flex items-center gap-1 rounded-pill bg-bee-yellow/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-bee-amber">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Gemini AI
                  <Wifi className="h-3 w-3 text-success" aria-hidden="true" />
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-pill bg-surface-alt px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
                  <WifiOff className="h-3 w-3" aria-hidden="true" />
                  Offline
                </span>
              )}
            </div>
            <p className="text-2xl font-bold leading-snug">{simplified}</p>
          </div>

          {/* 
            Interactive DVC Video Clips (from training/clips/clips)
          */}
          {matchedClips.length > 0 && (
            <div className="flex flex-col gap-3">
              {matchedClips.map((clip, index) => (
                <div key={`${clip}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-border-lining shadow-[2px_2px_0px_0px_var(--shadow-color)]">
                  <video
                    src={clip}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/*
            FSL visual: only shown when the typed message exactly matches a
            library preset AND no DVC clips were found.
          */}
          {matchedClips.length === 0 && matched && (
            <SignVisual
              phraseId={matched.id}
              alt={`${t("comm.signAlt")}${matched.text}`}
              fslUrl={matched.fslVisualUrl}
              aslUrl={matched.aslVisualUrl}
              fslLabel={t("comm.fslBadge")}
              aslLabel={t("comm.aslBadge")}
              fallback={null}
            />
          )}

          <SpeakButton text={simplified} label={t("hearing.speakSimplified")} />

          {suggestions.length > 0 && (
            <section aria-labelledby="suggested">
              <h2 id="suggested" className="mb-2 font-extrabold">
                {t("hearing.suggested")}
              </h2>
              <ul className="flex flex-col gap-3">
                {suggestions.map((phrase) => (
                  <li key={phrase.id}>
                    <PhraseCard phrase={phrase} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
