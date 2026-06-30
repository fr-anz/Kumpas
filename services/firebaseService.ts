/**
 * Placeholder for optional future Firebase sync.
 *
 * Core features never require Firebase or any sign-in. This file exists only
 * to mark the future integration point. When implemented, all calls must be
 * network-only and degrade gracefully when offline.
 */

export const isFirebaseConfigured = false;

export async function syncProfile(): Promise<void> {
  throw new Error("firebaseService is a placeholder and not implemented.");
}
