"use client";

import { useEffect, useState } from "react";

/**
 * Captures the browser's `beforeinstallprompt` event so the app can offer its
 * own "Install" button, instead of relying on users finding the browser's
 * hidden install option.
 *
 * State meanings:
 *   - canInstall: the browser fired the install prompt and it's available
 *   - installed:  the app is already installed / running standalone
 *   - promptInstall(): triggers the native install dialog
 *
 * Notes:
 *   - iOS Safari does NOT support beforeinstallprompt. There we detect that we
 *     can't prompt and the UI shows manual instructions instead.
 */

// Minimal type for the non-standard event.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallState = {
  canInstall: boolean;
  installed: boolean;
  /** True on iOS Safari, where install is manual (Share → Add to Home Screen). */
  iosManual: boolean;
  promptInstall: () => Promise<void>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function useInstallPrompt(): InstallState {
  const [deferred, setDeferred] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosManual, setIosManual] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIosManual(isIos() && !isStandalone());

    const onBeforeInstall = (e: Event) => {
      e.preventDefault(); // stop the mini-infobar; we drive the prompt ourselves
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    // The event can only be used once.
    setDeferred(null);
  };

  return {
    canInstall: !!deferred && !installed,
    installed,
    iosManual,
    promptInstall,
  };
}
