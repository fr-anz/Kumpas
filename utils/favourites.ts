/**
 * Favourites — localStorage-backed set of starred phrase IDs.
 */

const KEY = "kumpas.favourites";

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function loadFavourites(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isFavourite(phraseId: string): boolean {
  return loadFavourites().includes(phraseId);
}

export function toggleFavourite(phraseId: string): boolean {
  if (!hasStorage()) return false;
  try {
    const current = loadFavourites();
    const isNowFav = !current.includes(phraseId);
    const updated = isNowFav
      ? [...current, phraseId]
      : current.filter((id) => id !== phraseId);
    window.localStorage.setItem(KEY, JSON.stringify(updated));
    return isNowFav;
  } catch {
    return false;
  }
}

export function clearFavourites(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
