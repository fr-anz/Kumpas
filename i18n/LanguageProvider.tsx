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
import { loadLanguage, saveLanguage } from "@/services/storageService";
import { translations, speechLang, type Language } from "./translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Translate a key for the active language. Falls back to the key itself. */
  t: (key: string) => string;
  /** BCP-47 tag for SpeechSynthesis in the active language. */
  speechLocale: string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = loadLanguage();
    setLanguageState(saved);
    document.documentElement.lang = saved === "fil" ? "fil" : "en";
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    saveLanguage(next);
    document.documentElement.lang = next === "fil" ? "fil" : "en";
  }, []);

  const t = useCallback(
    (key: string) => translations[language][key] ?? translations.en[key] ?? key,
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      speechLocale: speechLang[language],
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
