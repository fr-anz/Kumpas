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
  const words = label.split(" ");
  const maxWordLength = Math.max(...words.map((w) => w.length));

  // Dynamically scale title font down if it contains a very long word to prevent word-breaks
  const titleSizeClass =
    maxWordLength >= 14
      ? "text-[13px] tracking-tighter min-[375px]:text-sm sm:text-base"
      : maxWordLength >= 11
        ? "text-sm tracking-tight min-[375px]:text-[15px] sm:text-base"
        : "text-base tracking-tight sm:text-lg";

  return (
    <Link
      href={`/library?category=${category.id}`}
      className="flex min-h-28 flex-col justify-start rounded-3xl bg-surface p-4 border border-border-lining shadow-[2px_2px_0px_0px_var(--shadow-color)] transition-all hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--shadow-color)]"
    >
      <Icon aria-hidden="true" className="h-7 w-7 mb-2 text-bee-amber" />
      <div className="flex flex-col">
        <span className={`block font-extrabold leading-tight text-balance ${titleSizeClass}`}>
          {label}
        </span>
        <span className="block text-xs sm:text-sm text-text-muted text-balance mt-1">
          {description}
        </span>
      </div>
    </Link>
  );
}
