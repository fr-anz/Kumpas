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
  type ThemePreference,
} from "@/services/storageService";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  // Load the saved theme on mount and apply it. Font size is handled
  // separately by FontSizeProvider (single source of truth).
  useEffect(() => {
    const savedTheme = loadTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    saveTheme(next);
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
