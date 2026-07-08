"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Moon, Sun } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useTheme } from "@/components/ThemeProvider";
import { BeeLogo } from "./BeeLogo";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Black header bar with the yellow Kumpas wordmark, per the bee theme. */
export function AppHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isSettings = pathname === "/settings";
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-bee-black bg-bee-yellow text-bee-black">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-4 sm:px-8 lg:max-w-5xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-bee-black sm:text-3xl"
        >
          <BeeLogo className="h-8 w-8 sm:h-10 sm:w-10" />
          <span>Kumpas</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge />
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border border-bee-black text-bee-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Moon aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
          {isSettings ? (
            <button
              id="settings-btn"
              onClick={() => router.back()}
              aria-label="Close settings"
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border border-bee-black text-bee-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Settings aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : (
            <Link
              id="settings-btn"
              href="/settings"
              aria-label={t("header.settings")}
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border border-bee-black text-bee-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Settings aria-hidden="true" className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
