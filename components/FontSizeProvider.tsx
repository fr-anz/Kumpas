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
import {
  loadFontSize,
  saveFontSize,
  type FontSizePreference,
} from "@/services/storageService";

type FontSizeContextValue = {
  fontSize: FontSizePreference;
  setFontSize: (size: FontSizePreference) => void;
};

const FontSizeContext = createContext<FontSizeContextValue | undefined>(
  undefined,
);

function applyFontSize(size: FontSizePreference) {
  document.documentElement.setAttribute("data-font-size", size);
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizePreference>("normal");

  useEffect(() => {
    const saved = loadFontSize();
    setFontSizeState(saved);
    applyFontSize(saved);
  }, []);

  const setFontSize = useCallback((next: FontSizePreference) => {
    setFontSizeState(next);
    saveFontSize(next);
    applyFontSize(next);
  }, []);

  const value = useMemo(
    () => ({ fontSize, setFontSize }),
    [fontSize, setFontSize],
  );

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize(): FontSizeContextValue {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider");
  }
  return context;
}
