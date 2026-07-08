"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Privacy & Terms — plain-language summary of how Kumpas handles data. */
export default function PrivacyPage() {
  const { t } = useLanguage();

  const points = [
    "privacy.p1",
    "privacy.p2",
    "privacy.p3",
    "privacy.p4",
    "privacy.p5",
    "privacy.p6",
    "privacy.p7",
    "privacy.p8",
  ];

  return (
    <div className="flex flex-col gap-6 page-enter">
      <Link
        href="/settings"
        className="flex min-h-11 w-fit items-center gap-2 rounded-button px-3 text-base font-bold text-text-muted transition-colors hover:bg-surface-alt"
      >
        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
        {t("privacy.back")}
      </Link>

      <header className="flex items-center gap-3">
        <ShieldCheck aria-hidden="true" className="h-8 w-8 text-success" />
        <h1 className="text-3xl font-black tracking-tight">
          {t("privacy.title")}
        </h1>
      </header>

      <p className="text-lg leading-relaxed text-text-muted">
        {t("privacy.intro")}
      </p>

      <ul className="flex flex-col gap-3">
        {points.map((key) => (
          <li
            key={key}
            className="flex items-start gap-3 rounded-card border border-border bg-surface p-4 shadow-[var(--shadow)]"
          >
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-bee-yellow"
            />
            <span className="text-base leading-relaxed">{t(key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
