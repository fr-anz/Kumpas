import type { UserProfile } from "@/types/userProfile";

/**
 * Local persistence using localStorage. All access is guarded so the app
 * works during SSR and in browsers where storage is blocked.
 */

const PROFILE_KEY = "kumpas.profile";
const THEME_KEY = "kumpas.theme";
const LANG_KEY = "kumpas.lang";
const FONT_SIZE_KEY = "kumpas.fontSize";
const ONBOARDED_KEY = "kumpas.onboarded";

export type ThemePreference = "light" | "dark" | "system";
export type LanguagePreference = "en" | "fil";
export type FontSizePreference = "normal" | "large" | "xlarge";

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
    window.localStorage.removeItem(FONT_SIZE_KEY);
    window.localStorage.removeItem(ONBOARDED_KEY);
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

export function loadFontSize(): FontSizePreference {
  if (!hasStorage()) return "normal";
  try {
    const value = window.localStorage.getItem(FONT_SIZE_KEY);
    if (value === "normal" || value === "large" || value === "xlarge") {
      return value;
    }
    return "normal";
  } catch {
    return "normal";
  }
}

export function saveFontSize(size: FontSizePreference): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(FONT_SIZE_KEY, size);
  } catch {
    // ignore
  }
}

export function loadOnboarded(): boolean {
  if (!hasStorage()) return false;
  try {
    return window.localStorage.getItem(ONBOARDED_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveOnboarded(done: boolean): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(ONBOARDED_KEY, done ? "true" : "false");
  } catch {
    // ignore
  }
}

/**
 * Clear all data AND signal the app to return to onboarding. Dispatches a
 * window event that AppGate listens for so no full reload is required.
 */
export function resetAndOnboard(): void {
  clearAllData();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kumpas:reset-onboarding"));
  }
}

