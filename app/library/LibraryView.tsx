"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { phrases } from "@/data/phrases";
import { PhraseCard } from "@/components/PhraseCard";
import type { PhraseCategory } from "@/types/phrase";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Phrase library with category filter chips and an optional search field. */
export function LibraryView() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const initialCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState<PhraseCategory | "all">(
    isCategory(initialCategory) ? initialCategory : "all",
  );
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return phrases.filter((phrase) => {
      const matchesCategory =
        activeCategory === "all" || phrase.category === activeCategory;
      const matchesQuery =
        !term ||
        phrase.title.toLowerCase().includes(term) ||
        phrase.text.toLowerCase().includes(term) ||
        phrase.titleFil.toLowerCase().includes(term) ||
        phrase.textFil.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-black tracking-tight">
        {t("library.title")}
      </h1>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("library.search")}
        aria-label={t("library.search")}
        className="min-h-12 rounded-button border border-border bg-surface px-4 text-base shadow-[var(--shadow)]"
      />

      {/* Category filter chips. */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t("library.filterAria")}
      >
        <Chip
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          {t("library.all")}
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {language === "fil" ? category.labelFil : category.label}
          </Chip>
        ))}
      </div>

      {visible.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {visible.map((phrase) => (
            <li key={phrase.id}>
              <PhraseCard phrase={phrase} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="hex-pattern rounded-card border border-dashed border-border p-8 text-center text-text-muted">
          {t("library.noResults")}
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-12 rounded-pill px-4 text-sm font-bold transition-colors ${
        active
          ? "bg-bee-yellow text-bee-black"
          : "border border-border bg-surface text-text hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}

function isCategory(value: string | null): value is PhraseCategory {
  return (
    value === "emergency" ||
    value === "health" ||
    value === "barangay" ||
    value === "transportation" ||
    value === "school" ||
    value === "basic"
  );
}
