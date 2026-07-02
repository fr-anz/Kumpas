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

/** Common words to ignore when scoring, so they don't create noise. */
const STOPWORDS = new Set([
  // English
  "the", "a", "an", "is", "are", "to", "of", "and", "or", "for", "in", "on",
  "at", "it", "this", "that", "please", "you", "your", "my", "me", "i",
  // Filipino
  "ang", "ng", "sa", "na", "ay", "ako", "mo", "ko", "po", "yung", "ito",
]);

/** Normalize text to comparable lowercase word tokens. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ") // keep letters (incl. accented) + spaces
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Suggest library phrases related to the input message. Matches against BOTH
 * languages (English + Filipino, title + text) so e.g. typing "yes", "no",
 * "salamat", or "tulong" surfaces the matching preset even for short words.
 */
export function suggestPhrases(
  input: string,
  language: Language = "en",
  limit = 3,
): Phrase[] {
  const normalizedInput = input.toLowerCase().trim();
  if (!normalizedInput) return [];

  const inputTokens = tokenize(input);
  // Meaningful tokens: drop stopwords, but KEEP short words (yes/no/oo).
  const meaningful = new Set(
    inputTokens.filter((w) => !STOPWORDS.has(w)),
  );
  if (meaningful.size === 0) {
    // Input was only stopwords — still allow direct phrase containment below.
    inputTokens.forEach((w) => meaningful.add(w));
  }

  const scored = phrases.map((phrase) => {
    // Compare against all four representations for robustness.
    const fields = [
      phrase.text,
      phrase.title,
      phrase.textFil,
      phrase.titleFil,
    ];

    let score = 0;

    for (const field of fields) {
      const fieldTokens = tokenize(field);
      if (fieldTokens.length === 0) continue;

      // Strong boost: every meaningful token of the phrase appears in the
      // input (whole-word), or the input exactly matches the phrase text.
      const contentTokens = fieldTokens.filter((tk) => !STOPWORDS.has(tk));
      const allPresent =
        contentTokens.length > 0 &&
        contentTokens.every((tk) => meaningful.has(tk));
      if (allPresent || normalizedInput === fieldTokens.join(" ")) {
        score += 10;
      }

      // Partial token overlap.
      for (const token of fieldTokens) {
        if (STOPWORDS.has(token)) continue;
        if (meaningful.has(token)) score += 2;
      }
    }

    return { phrase, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.phrase);
}
