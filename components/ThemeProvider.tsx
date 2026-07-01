"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loadTheme,
  saveTheme,
  loadFontSize,
  saveFontSize,
  type ThemePreference,
  type FontSizePreference,
} from "@/services/storageService";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  fontSize: FontSizePreference;
  setFontSize: (size: FontSizePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

function applyFontSize(size: FontSizePreference) {
  const root = document.documentElement;
  root.setAttribute("data-font-size", size);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [fontSize, setFontSizeState] = useState<FontSizePreference>("normal");

  // Load saved preferences on mount and apply them.
  useEffect(() => {
    const savedTheme = loadTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    const savedFontSize = loadFontSize();
    setFontSizeState(savedFontSize);
    applyFontSize(savedFontSize);
  }, []);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    saveTheme(next);
    applyTheme(next);
  }, []);

  const setFontSize = useCallback((next: FontSizePreference) => {
    setFontSizeState(next);
    saveFontSize(next);
    applyFontSize(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
