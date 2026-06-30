import type { Language } from "@/i18n/translations";

/**
 * Maps sign-recognition labels to spoken phrases in each language.
 * Used by the mock predictor today and the real TF.js model later.
 */
export const labelToPhrase: Record<string, Record<Language, string>> = {
  HELP: { en: "I need help.", fil: "Kailangan ko ng tulong." },
  YES: { en: "Yes.", fil: "Oo." },
  NO: { en: "No.", fil: "Hindi." },
  HOSPITAL: {
    en: "I need to go to the hospital.",
    fil: "Kailangan kong pumunta sa ospital.",
  },
  I_AM_DEAF: { en: "I am Deaf.", fil: "Bingi ako." },
  PAIN: { en: "I am in pain.", fil: "Masakit ang pakiramdam ko." },
  DEAF: { en: "I am Deaf.", fil: "Bingi ako." },
  SLOW: { en: "Please slow down.", fil: "Pakibagalan." },
  DONT_UNDERSTAND: {
    en: "I don't understand.",
    fil: "Hindi ko maintindihan.",
  },
  THANK_YOU: { en: "Thank you.", fil: "Salamat." },
};

export const labels = Object.keys(labelToPhrase);

export function phraseForLabel(label: string, language: Language = "en"): string {
  return labelToPhrase[label]?.[language] ?? label;
}
