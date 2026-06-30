import type { UserProfile } from '../types/userProfile';

const PROFILE_KEY = 'kumpas_profile_v1';

export function getProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearAllData(): void {
  localStorage.clear();
}
