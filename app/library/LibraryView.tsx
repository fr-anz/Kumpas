"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { categories } from "@/data/categories";
import { phrases } from "@/data/phrases";
import { PhraseCard } from "@/components/PhraseCard";
import type { PhraseCategory } from "@/types/phrase";
import { useLanguage } from "@/i18n/LanguageProvider";
import { loadFavourites } from "@/utils/favourites";

type FilterMode = PhraseCategory | "all" | "favourites";

/** Phrase library with horizontal scrollable category filter and favourites. */
export function LibraryView() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const initialCategory = searchParams.get("category");

  const [activeFilter, setActiveFilter] = useState<FilterMode>(
    isCategory(initialCategory) ? initialCategory : "all",
  );
  const [query, setQuery] = useState("");
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  // Load favourites on mount (client only).
  useEffect(() => {
    setFavouriteIds(loadFavourites());
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return phrases.filter((phrase) => {
      if (activeFilter === "favourites") {
        if (!favouriteIds.includes(phrase.id)) return false;
      } else if (activeFilter !== "all") {
        if (phrase.category !== activeFilter) return false;
      }
      if (!term) return true;
      return (
        phrase.title.toLowerCase().includes(term) ||
        phrase.text.toLowerCase().includes(term) ||
        phrase.titleFil.toLowerCase().includes(term) ||
        phrase.textFil.toLowerCase().includes(term)
      );
    });
  }, [activeFilter, query, favouriteIds]);

  return (
    <div className="flex flex-col gap-6 page-enter">
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

      {/* Horizontal scrollable category filter — no-scrollbar hides the track */}
      <div
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8"
        role="group"
        aria-label={t("library.filterAria")}
      >
        <Chip active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
          {t("library.all")}
        </Chip>

        {/* Starred / favourites chip */}
        <Chip
          active={activeFilter === "favourites"}
          onClick={() => setActiveFilter("favourites")}
          icon={<Star className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Starred
        </Chip>

        {categories.map((category) => (
          <Chip
            key={category.id}
            active={activeFilter === category.id}
            onClick={() => setActiveFilter(category.id)}
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
          {activeFilter === "favourites"
            ? "No starred phrases yet. Tap ★ on any phrase card to save it here."
            : t("library.noResults")}
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-shrink-0 items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-bold transition-colors ${
        active
          ? "bg-bee-yellow text-bee-black"
          : "border border-border bg-surface text-text hover:bg-surface-alt"
      }`}
    >
      {icon}
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
