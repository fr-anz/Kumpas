"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

/**
 * A slim banner that appears only when the device goes offline, reassuring
 * the user that core features still work.
 */
export function OfflineIndicator() {
  const { t } = useLanguage();
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

  if (online) return null;

  return (
    <div
      role="status"
      className="bg-warn/20 px-5 py-2 text-center text-sm font-bold text-[color:var(--bee-amber)]"
    >
      {t("status.offlineBanner")}
    </div>
  );
}
