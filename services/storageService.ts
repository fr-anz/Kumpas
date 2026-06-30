import type { UserProfile } from "@/types/userProfile";

/**
 * Local persistence using localStorage. All access is guarded so the app
 * works during SSR and in browsers where storage is blocked.
 */

const PROFILE_KEY = "kumpas.profile";
const THEME_KEY = "kumpas.theme";
const LANG_KEY = "kumpas.lang";

export type ThemePreference = "light" | "dark" | "system";
export type LanguagePreference = "en" | "fil";

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function loadProfile(): UserProfile | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage full or blocked — fail silently, the UI stays usable.
  }
}

export function clearAllData(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(THEME_KEY);
    window.localStorage.removeItem(LANG_KEY);
  } catch {
    // ignore
  }
}

export function loadTheme(): ThemePreference {
  if (!hasStorage()) return "system";
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    if (value === "light" || value === "dark" || value === "system") {
      return value;
    }
    return "system";
  } catch {
    return "system";
  }
}

export function saveTheme(theme: ThemePreference): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

export function loadLanguage(): LanguagePreference {
  if (!hasStorage()) return "en";
  try {
    const value = window.localStorage.getItem(LANG_KEY);
    if (value === "en" || value === "fil") {
      return value;
    }
    return "en";
  } catch {
    return "en";
  }
}

export function saveLanguage(language: LanguagePreference): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(LANG_KEY, language);
  } catch {
    // ignore
  }
}
