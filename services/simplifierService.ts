import { phrases } from "@/data/phrases";
import type { Phrase } from "@/types/phrase";
import type { Language } from "@/i18n/translations";

/**
 * Local, rule-based message simplifier. No network or Gemini required.
 * Goal: make hearing-staff messages shorter and clearer for the Deaf user.
 */

const EN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bbecause\b/gi, ". Reason:"],
  [/\bis still being processed\b/gi, "is not ready yet"],
  [/\bplease be advised that\b/gi, ""],
  [/\bkindly\b/gi, "please"],
  [/\bat this point in time\b/gi, "now"],
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bprovide\b/gi, "give"],
  [/\bassistance\b/gi, "help"],
  [/\brequirements?\b/gi, "papers"],
  [/\bcurrently\b/gi, "now"],
  [/\butilize\b/gi, "use"],
];

const FIL_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bdahil sa katotohanang\b/gi, "dahil"],
  [/\bsa kasalukuyan\b/gi, "ngayon"],
  [/\bpinoproseso pa\b/gi, "hindi pa tapos"],
  [/\bmangyaring\b/gi, "paki"],
  [/\bupang maaari\b/gi, "para"],
  [/\bmga kinakailangan\b/gi, "mga papeles"],
];

export function simplify(input: string, language: Language = "en"): string {
  let text = input.trim();
  if (!text) return "";

  const replacements = language === "fil" ? FIL_REPLACEMENTS : EN_REPLACEMENTS;
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  // Split into short sentences and trim filler whitespace.
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((sentence) => {
      // Capitalize first letter and ensure terminal punctuation.
      const capped = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      return /[.!?]$/.test(capped) ? capped : `${capped}.`;
    });

  return sentences.join(" ").replace(/\.\s*\./g, ".").trim();
}

/** Suggest library phrases whose words overlap the input message. */
export function suggestPhrases(
  input: string,
  language: Language = "en",
  limit = 3,
): Phrase[] {
  const words = new Set(
    input
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  );
  if (words.size === 0) return [];

  const scored = phrases
    .map((phrase) => {
      const source = language === "fil" ? phrase.textFil : phrase.text;
      const phraseWords = source
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/);
      const score = phraseWords.reduce(
        (total, word) => total + (words.has(word) ? 1 : 0),
        0,
      );
      return { phrase, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.phrase);
}
