"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { BeeLogo } from "./BeeLogo";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Black header bar with the yellow Kumpas wordmark, per the bee theme. */
export function AppHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isSettings = pathname === "/settings";

  return (
    <header className="sticky top-0 z-20 border-b-2 border-bee-black bg-bee-yellow text-bee-black">
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
          {isSettings ? (
            <button
              onClick={() => router.back()}
              aria-label="Close settings"
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border-2 border-bee-black text-bee-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Settings aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/settings"
              aria-label={t("header.settings")}
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-white border-2 border-bee-black text-bee-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Settings aria-hidden="true" className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
