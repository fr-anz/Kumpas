"use client";

import Link from "next/link";
import { Siren, MessageSquare, Camera } from "lucide-react";
import { categories } from "@/data/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Home: emergency action, category grid, and quick links to the other modes. */
export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="home-title">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-text-muted">
          {t("home.eyebrow")}
        </p>
        <h1
          id="home-title"
          className="max-w-2xl text-4xl font-black leading-[1.0] tracking-tight sm:text-5xl"
        >
          {t("home.title")}
        </h1>
      </section>

      {/* Large primary emergency action. */}
      <Link
        href="/emergency"
        className="flex min-h-20 w-full items-center justify-center gap-3 rounded-card bg-danger px-6 text-center text-2xl font-black text-white shadow-[var(--shadow)] transition-colors hover:brightness-110"
      >
        <Siren aria-hidden="true" className="h-8 w-8" />
        {t("home.emergency")}
      </Link>

      <section aria-labelledby="cat-title">
        <h2 id="cat-title" className="mb-3 text-xl font-extrabold">
          {t("home.phraseCategories")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section aria-labelledby="modes-title">
        <h2 id="modes-title" className="mb-3 text-xl font-extrabold">
          {t("home.moreTools")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/hearing"
            className="flex min-h-16 items-center gap-3 rounded-card border border-border bg-surface px-5 text-lg font-bold shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5"
          >
            <MessageSquare aria-hidden="true" className="h-6 w-6 text-bee-amber" />
            {t("home.hearingMode")}
          </Link>
          <Link
            href="/camera"
            className="flex min-h-16 items-center gap-3 rounded-card border border-border bg-surface px-5 text-lg font-bold shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5"
          >
            <Camera aria-hidden="true" className="h-6 w-6 text-bee-amber" />
            {t("home.cameraDemo")}
          </Link>
        </div>
      </section>
    </div>
  );
}
