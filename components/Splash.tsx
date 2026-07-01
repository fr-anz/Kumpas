"use client";

import { BeeLogo } from "./BeeLogo";

/**
 * Full-screen splash shown on first load: the bee flies in and hovers while
 * the app decides whether to show onboarding or the main app. `leaving`
 * triggers the fade-out.
 */
export function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-bg ${
        leaving ? "splash-out" : ""
      }`}
      aria-hidden="true"
    >
      <div className="hex-pattern absolute inset-0 opacity-40" />
      <div className="bee-fly-in relative">
        <BeeLogo className="h-28 w-28 drop-shadow-lg" />
      </div>
      <p className="splash-title relative text-3xl font-black tracking-tight">
        Kumpas
      </p>
    </div>
  );
}
