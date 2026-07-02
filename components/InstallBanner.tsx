"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "./useInstallPrompt";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BeeLogo } from "./BeeLogo";

const DISMISS_KEY = "kumpas.installBannerDismissed";

/**
 * Dismissible install prompt shown on Home for first-time visitors on browsers
 * that support installation. Once dismissed, it stays hidden (persisted). iOS
 * users are pointed to Settings for the manual instructions instead.
 */
export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(true); // hidden until we check

  useEffect(() => {
    try {
      setDismissed(
        window.localStorage.getItem(DISMISS_KEY) === "true",
      );
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed || !canInstall) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-card border border-bee-yellow bg-bee-yellow/10 p-4 shadow-[var(--shadow)]">
      {/* Dismiss — pinned top-right, out of the text flow */}
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("install.bannerDismiss")}
        className="absolute right-2 top-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-pill text-text-muted transition-colors hover:bg-surface-alt"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>

      {/* Logo + text: text gets full width, wraps cleanly at any size */}
      <div className="flex items-start gap-3 pr-9">
        <BeeLogo className="h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">{t("install.bannerTitle")}</p>
          <p className="text-sm text-text-muted">{t("install.bannerBody")}</p>
        </div>
      </div>

      {/* Action: full-width row below, never competes with text for space */}
      <button
        type="button"
        onClick={promptInstall}
        className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-button bg-bee-yellow px-4 font-black text-bee-black transition-colors hover:bg-bee-yellow-bright"
      >
        <Download aria-hidden="true" className="h-4 w-4 shrink-0" />
        {t("install.bannerAction")}
      </button>
    </div>
  );
}
