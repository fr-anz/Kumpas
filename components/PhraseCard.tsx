"use client";

import Link from "next/link";
import type { Phrase } from "@/types/phrase";
import { useLanguage } from "@/i18n/LanguageProvider";

/** List item for a phrase. Urgent phrases get a danger-red left border + badge. */
export function PhraseCard({ phrase }: { phrase: Phrase }) {
  const { language, t } = useLanguage();
  const urgent = phrase.priority === "urgent";
  const title = language === "fil" ? phrase.titleFil : phrase.title;
  const text = language === "fil" ? phrase.textFil : phrase.text;

  return (
    <Link
      href={`/communication/${phrase.id}`}
      className={`flex items-center justify-between gap-3 rounded-card border bg-surface p-4 shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${
        urgent
          ? "border-l-4 border-l-danger border-border"
          : "border-border"
      }`}
    >
      <span className="min-w-0">
        <span className="block truncate text-lg font-bold">{title}</span>
        <span className="block truncate text-sm text-text-muted">{text}</span>
      </span>
      {urgent && (
        <span className="shrink-0 rounded-pill bg-danger px-2.5 py-1 text-xs font-bold text-white">
          {t("library.urgent")}
        </span>
      )}
    </Link>
  );
}
