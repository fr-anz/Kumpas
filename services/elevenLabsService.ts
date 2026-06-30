/**
 * ElevenLabs text-to-speech — used ONLY for Filipino speech.
 *
 * Quota note: the provided key is limited to 10,000 characters, so this is
 * deliberately scoped to Filipino output only. Results are cached in-session
 * (keyed by text) so replaying the same phrase does not spend more characters.
 *
 * Security note: this app is a static export with no server, so the key is a
 * NEXT_PUBLIC_ value embedded in the client bundle. This is acceptable for
 * local development / demos only. Do not deploy publicly with a real key.
 */

const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? "";
// Default multilingual voice ("Rachel") — works with the multilingual model
// that supports Tagalog. Override via NEXT_PUBLIC_ELEVENLABS_VOICE_ID.
const VOICE_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const MODEL_ID = "eleven_multilingual_v2";

/** Whether an ElevenLabs key is configured. */
export function isElevenLabsConfigured(): boolean {
  return API_KEY.length > 0;
}

// In-session cache of generated audio, keyed by the spoken text, so repeated
// plays of the same phrase reuse audio instead of spending more characters.
const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

/** Stop any ElevenLabs audio that is currently playing. */
export function stopElevenLabs(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Speak text via ElevenLabs. Returns true on success, false if it could not
 * play (no key, offline, API error) so the caller can fall back to the
 * browser's built-in speech.
 */
export async function speakWithElevenLabs(text: string): Promise<boolean> {
  const trimmed = text.trim();
  if (!isElevenLabsConfigured() || !trimmed) return false;
  if (typeof window === "undefined") return false;
  // Don't even attempt a network call when offline.
  if (typeof navigator !== "undefined" && !navigator.onLine) return false;

  try {
    stopElevenLabs();

    let url = audioCache.get(trimmed);

    if (!url) {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": API_KEY,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text: trimmed,
            model_id: MODEL_ID,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        },
      );

      if (!response.ok) return false;

      const blob = await response.blob();
      url = URL.createObjectURL(blob);
      audioCache.set(trimmed, url);
    }

    const audio = new Audio(url);
    currentAudio = audio;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}
