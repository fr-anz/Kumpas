"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * Shows whether the device is online or offline, driven by navigator.onLine
 * and the browser connectivity events. Offline is the normal, expected state.
 */
export function StatusBadge() {
  const { t } = useLanguage();
  // Default to online for the first server render; corrected on mount.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border transition-colors ${
        online
          ? "bg-white/5 border-white/10 text-white/90"
          : "bg-bee-amber/10 border-bee-amber/20 text-bee-amber"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          online ? "bg-success shadow-[0_0_6px_rgba(34,197,94,0.6)]" : "bg-bee-amber"
        }`}
      />
      {online ? t("status.online") : t("status.offlineReady")}
    </span>
  );
}
