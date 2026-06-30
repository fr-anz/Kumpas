"use client";

import Link from "next/link";
import type { Category } from "@/data/categories";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Rectangular (legible) category tile with a honeycomb-inspired accent. */
export function CategoryCard({ category }: { category: Category }) {
  const { language } = useLanguage();
  const Icon = category.icon;
  const label = language === "fil" ? category.labelFil : category.label;
  const description =
    language === "fil" ? category.descriptionFil : category.description;
  return (
    <Link
      href={`/library?category=${category.id}`}
      className="flex min-h-28 flex-col justify-between rounded-card border border-border bg-surface p-4 shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
    >
      <Icon aria-hidden="true" className="h-7 w-7 text-bee-amber" />
      <span>
        <span className="block text-lg font-extrabold leading-tight">
          {label}
        </span>
        <span className="block text-sm text-text-muted">{description}</span>
      </span>
    </Link>
  );
}
