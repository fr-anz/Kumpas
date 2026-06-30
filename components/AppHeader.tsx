"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Black header bar with the yellow Kumpas wordmark, per the bee theme. */
export function AppHeader() {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-20 border-b border-black/20 bg-bee-black">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-[-0.04em] text-bee-yellow"
        >
          <BeeLogo />
          Kumpas
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge />
          <Link
            href="/settings"
            aria-label={t("header.settings")}
            className="flex h-10 w-10 items-center justify-center rounded-pill text-bee-yellow transition-colors hover:bg-white/10"
          >
            <Settings aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Simple hexagon "bee" mark built from an inline SVG (no emoji). */
function BeeLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="currentColor"
    >
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" opacity="0.25" />
      <path
        d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
