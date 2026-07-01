/**
 * Recent phrases — localStorage-backed list of recently viewed phrase IDs.
 * Max 4 entries, FIFO. Used on the Home page for quick repeat access.
 */

const KEY = "kumpas.recents";
const MAX = 4;

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function loadRecents(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function pushRecent(phraseId: string): void {
  if (!hasStorage()) return;
  try {
    const current = loadRecents().filter((id) => id !== phraseId);
    const updated = [phraseId, ...current].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearRecents(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
