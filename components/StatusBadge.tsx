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
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-bold ${
        online
          ? "bg-success/15 text-success"
          : "bg-warn/20 text-[color:var(--bee-amber)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${
          online ? "bg-success" : "bg-warn"
        }`}
      />
      {online ? t("status.online") : t("status.offlineReady")}
    </span>
  );
}
