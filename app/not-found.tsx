"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="hex-pattern flex min-h-[50dvh] flex-col items-center justify-center gap-4 rounded-card border border-dashed border-border p-8 text-center">
      <Hexagon aria-hidden="true" className="h-12 w-12 text-bee-amber" />
      <h1 className="text-2xl font-black">{t("notFound.title")}</h1>
      <p className="text-text-muted">{t("notFound.body")}</p>
      <Link
        href="/"
        className="flex min-h-12 items-center justify-center rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black"
      >
        {t("notFound.goHome")}
      </Link>
    </div>
  );
}
