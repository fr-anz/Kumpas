/**
 * Thin wrapper around the browser SpeechSynthesis API.
 * Every function is defensive: the app must never crash if speech is
 * unavailable (older devices, locked-down browsers, SSR).
 */

import {
  isElevenLabsConfigured,
  speakWithElevenLabs,
  stopElevenLabs,
} from "./elevenLabsService";

export function isSpeechSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance !== "undefined"
  );
}

/**
 * Voices load asynchronously in most browsers: the first getVoices() call
 * frequently returns an empty array until the "voiceschanged" event fires.
 * This resolves once a non-empty list is available (or times out).
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) {
      resolve([]);
      return;
    }

    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener("voiceschanged", finish, {
      once: true,
    });
    // Safety net: some browsers never fire the event reliably.
    window.setTimeout(finish, 1000);
  });
}

/**
 * Pick the best available voice for a locale.
 *
 * For Filipino (fil/tl), the fallback order matters a lot for intelligibility:
 *   1. A real Filipino/Tagalog voice (fil-PH, tl-PH) — ideal.
 *   2. A Spanish voice — Tagalog shares Spanish's 5-vowel system and most
 *      consonants, so Spanish pronounces Tagalog far more accurately than
 *      English does. This is the key quality fix.
 *   3. The system default — last resort.
 */
function pickVoice(
  voices: SpeechSynthesisVoice[],
  locale: string,
): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined;
  const lower = locale.toLowerCase();
  const langPrefix = lower.split("-")[0];

  const isFilipino = langPrefix === "fil" || langPrefix === "tl";

  const candidates: Array<(v: SpeechSynthesisVoice) => boolean> = [
    // Exact locale match
    (v) => v.lang.toLowerCase() === lower,
    // Same language prefix (e.g. any en-* / fil-*)
    (v) => v.lang.toLowerCase().startsWith(langPrefix),
  ];

  if (isFilipino) {
    // Tagalog is sometimes tagged tl instead of fil.
    candidates.push((v) => v.lang.toLowerCase().startsWith("tl"));
    candidates.push((v) => v.lang.toLowerCase().startsWith("fil"));
    // Spanish: best phonetic approximation when no Filipino voice exists.
    candidates.push((v) => v.lang.toLowerCase().startsWith("es"));
  }

  for (const match of candidates) {
    const found = voices.find(match);
    if (found) return found;
  }
  return undefined;
}

/** Whether a true Filipino/Tagalog voice is installed on this device. */
export async function hasFilipinoVoice(): Promise<boolean> {
  const voices = await loadVoices();
  return voices.some((v) => {
    const lang = v.lang.toLowerCase();
    return lang.startsWith("fil") || lang.startsWith("tl");
  });
}

export async function speak(
  text: string,
  locale = "en-US",
  onEnded?: () => void,
): Promise<void> {
  if (!text.trim()) {
    if (onEnded) onEnded();
    return;
  }

  const langPrefix = locale.toLowerCase().split("-")[0];
  const isFilipino = langPrefix === "fil" || langPrefix === "tl";

  // For Filipino ONLY, prefer ElevenLabs for natural pronunciation. It falls
  // back to browser speech if it's not configured, offline, or errors out.
  if (isFilipino && isElevenLabsConfigured()) {
    // Stop any browser speech first so they don't overlap.
    if (isSpeechSupported()) window.speechSynthesis.cancel();
    const ok = await speakWithElevenLabs(text, onEnded);
    if (ok) return;
    // Otherwise fall through to the browser synthesis path below.
  }

  if (!isSpeechSupported()) {
    if (onEnded) onEnded();
    return;
  }

  const voices = await loadVoices();

  // Cancel anything currently queued so phrases don't stack up.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 1;
  utterance.volume = 1;

  if (onEnded) {
    utterance.onend = () => onEnded();
    utterance.onerror = () => onEnded();
  }

  const voice = pickVoice(voices, locale);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = locale;
  }

  // Slightly slower for Filipino read by a non-native (e.g. Spanish) voice so
  // syllables are clearer; natural speed otherwise.
  const usingNonNative =
    isFilipino &&
    !!voice &&
    !(
      voice.lang.toLowerCase().startsWith("fil") ||
      voice.lang.toLowerCase().startsWith("tl")
    );
  utterance.rate = usingNonNative ? 0.9 : 1;

  window.speechSynthesis.speak(utterance);
}


export function stopSpeaking(): void {
  // Stop both engines so nothing keeps playing.
  stopElevenLabs();
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}
