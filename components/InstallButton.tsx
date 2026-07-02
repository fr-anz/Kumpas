"use client";

import { Download, CheckCircle2, Share } from "lucide-react";
import { useInstallPrompt } from "./useInstallPrompt";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * User-facing install control for the PWA. Shows the native install prompt on
 * supported browsers, manual instructions on iOS Safari, and a confirmation
 * when already installed.
 */
export function InstallButton() {
  const { canInstall, installed, iosManual, promptInstall } =
    useInstallPrompt();
  const { t } = useLanguage();

  if (installed) {
    return (
      <div className="flex items-center gap-2 rounded-button bg-success/15 px-4 py-3 text-sm font-semibold text-success">
        <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
        {t("install.installed")}
      </div>
    );
  }

  if (iosManual) {
    return (
      <div className="flex items-start gap-2 rounded-button bg-surface-alt p-3 text-sm font-semibold text-text-muted">
        <Share aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>{t("install.iosHint")}</p>
      </div>
    );
  }

  if (canInstall) {
    return (
      <button
        type="button"
        onClick={promptInstall}
        className="flex min-h-12 items-center justify-center gap-2 rounded-button bg-bee-yellow px-6 text-lg font-black text-bee-black transition-colors hover:bg-bee-yellow-bright active:bg-bee-amber"
      >
        <Download aria-hidden="true" className="h-5 w-5" />
        {t("install.button")}
      </button>
    );
  }

  // Not installable right now (already dismissed, unsupported, or not eligible).
  return (
    <p className="rounded-button bg-surface-alt px-4 py-3 text-sm font-semibold text-text-muted">
      {t("install.unavailable")}
    </p>
  );
}
