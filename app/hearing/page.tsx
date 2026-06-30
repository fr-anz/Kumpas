"use client";

import { useState } from "react";
import { simplify, suggestPhrases } from "@/services/simplifierService";
import { SpeakButton } from "@/components/SpeakButton";
import { PhraseCard } from "@/components/PhraseCard";
import type { Phrase } from "@/types/phrase";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Hearing person mode: staff types a message, the app simplifies it locally
 * (no Gemini required) and can speak the simplified version aloud.
 */
export default function HearingPage() {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [original, setOriginal] = useState("");
  const [simplified, setSimplified] = useState("");
  const [suggestions, setSuggestions] = useState<Phrase[]>([]);

  const handleSimplify = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setOriginal(trimmed);
    setSimplified(simplify(trimmed, language));
    setSuggestions(suggestPhrases(trimmed, language));
  };

  return (
    <div className="flex flex-col gap-6">
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
          placeholder={t("hearing.placeholder")}
          className="rounded-card border border-border bg-surface p-4 text-lg shadow-[var(--shadow)]"
        />
      </label>

      <button
        type="button"
        onClick={handleSimplify}
        className="flex min-h-12 items-center justify-center rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber"
      >
        {t("hearing.simplify")}
      </button>

      {simplified && (
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-border bg-surface-alt p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("hearing.original")}
            </p>
            <p className="mt-1 text-lg">{original}</p>
          </div>

          <div className="rounded-card border-2 border-bee-yellow bg-surface p-4 shadow-[var(--shadow)]">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              {t("hearing.simplified")}
            </p>
            <p className="mt-1 text-2xl font-bold leading-snug">{simplified}</p>
          </div>

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
