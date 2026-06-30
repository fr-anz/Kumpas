// ── Speech Synthesis wrapper ──────────────────────────────
// Gracefully degrades when the browser doesn't support TTS.

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string): void {
  if (!isSpeechSupported()) return;
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  // Try Philippine English first; fall back to plain English.
  utterance.lang = 'en-PH';
  utterance.rate = 0.88;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false;
  return window.speechSynthesis.speaking;
}
