"use client";

import { useEffect, useState } from "react";
import { loadOnboarded, saveOnboarded } from "@/services/storageService";
import { Onboarding } from "@/components/Onboarding";
import { Splash } from "@/components/Splash";

const SPLASH_MS = 1700; // let the bee fly in and hover

/**
 * Boot sequence:
 *   1. Show the bee fly-in splash on load.
 *   2. Decide onboarding vs app from the stored flag.
 *   3. Fade the splash out, then render the destination.
 */
export function AppGate({ children }: { children: React.ReactNode }) {
  const [dest, setDest] = useState<"onboarding" | "app" | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);

  // Resolve the destination immediately (client-only).
  useEffect(() => {
    setDest(loadOnboarded() ? "app" : "onboarding");
  }, []);

  // Time the splash out.
  useEffect(() => {
    const leaveTimer = window.setTimeout(
      () => setSplashLeaving(true),
      SPLASH_MS,
    );
    const doneTimer = window.setTimeout(
      () => setShowSplash(false),
      SPLASH_MS + 400, // matches splash-out duration
    );
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const finishOnboarding = () => {
    saveOnboarded(true);
    setDest("app");
  };

  // Allow re-entering onboarding after a data reset (see resetOnboarding).
  useEffect(() => {
    const handler = () => setDest("onboarding");
    window.addEventListener("kumpas:reset-onboarding", handler);
    return () => window.removeEventListener("kumpas:reset-onboarding", handler);
  }, []);

  return (
    <>
      {showSplash && <Splash leaving={splashLeaving} />}
      {dest === "onboarding" && <Onboarding onDone={finishOnboarding} />}
      {dest === "app" && children}
    </>
  );
}
