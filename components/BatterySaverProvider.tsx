"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Battery optimization setting. When enabled, expensive continuous animations
 * (the ShapeGrid background's requestAnimationFrame loop) are frozen to a
 * single static frame, saving battery on mobile devices.
 *
 * Defaults to ON when the user's OS requests reduced motion; otherwise OFF.
 * The explicit choice is persisted.
 */

const KEY = "kumpas.batterySaver";

type BatterySaverContextValue = {
  batterySaver: boolean;
  setBatterySaver: (on: boolean) => void;
};

const BatterySaverContext = createContext<BatterySaverContextValue | undefined>(
  undefined,
);

export function BatterySaverProvider({ children }: { children: ReactNode }) {
  const [batterySaver, setSaver] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "true" || saved === "false") {
        setSaver(saved === "true");
        return;
      }
    } catch {
      // ignore
    }
    // No saved choice: default from OS reduced-motion preference.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setSaver(!!reduce);
  }, []);

  const setBatterySaver = useCallback((on: boolean) => {
    setSaver(on);
    try {
      window.localStorage.setItem(KEY, on ? "true" : "false");
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ batterySaver, setBatterySaver }),
    [batterySaver, setBatterySaver],
  );

  return (
    <BatterySaverContext.Provider value={value}>
      {children}
    </BatterySaverContext.Provider>
  );
}

export function useBatterySaver(): BatterySaverContextValue {
  const ctx = useContext(BatterySaverContext);
  if (!ctx) {
    throw new Error("useBatterySaver must be used within BatterySaverProvider");
  }
  return ctx;
}
