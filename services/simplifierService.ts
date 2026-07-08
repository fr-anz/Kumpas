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

/* ── Offline spell correction ─────────────────────────────────────────────
 * Builds a vocabulary from the phrase library (both languages) plus key
 * domain terms, then fuzzy-corrects misspelled input words via edit distance.
 * e.g. "marriage licnse" → "marriage license", "barangy" → "barangay".
 */

// High-value domain terms that must be spelled correctly, beyond phrase text.
const DOMAIN_TERMS = [
  "marriage", "license", "barangay", "clearance", "certificate", "indigency",
  "residency", "cedula", "blotter", "report", "ayuda", "emergency", "medical",
  "hospital", "clinic", "ambulance", "medicine", "assistance", "document",
  "requirements", "captain", "deaf", "interpreter", "pharmacy", "terminal",
  "jeepney", "classroom", "assignment", "deadline", "signature",
];

let vocabCache: { en: Set<string>; fil: Set<string> } | null = null;

function buildVocab() {
  if (vocabCache) return vocabCache;
  const en = new Set<string>();
  const fil = new Set<string>();
  const add = (set: Set<string>, text: string) => {
    for (const w of text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)) {
      if (w.length >= 3) set.add(w);
    }
  };
  for (const p of phrases) {
    add(en, p.text);
    add(en, p.title);
    add(fil, p.textFil);
    add(fil, p.titleFil);
  }
  for (const term of DOMAIN_TERMS) en.add(term);
  vocabCache = { en, fil };
  return vocabCache;
}

/** Levenshtein edit distance with early exit when it exceeds `max`. */
function editDistance(a: string, b: string, max: number): number {
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  let prev = Array.from({ length: bl + 1 }, (_, i) => i);
  for (let i = 1; i <= al; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      cur[j] = val;
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > max) return max + 1; // whole row exceeds budget
    prev = cur;
  }
  return prev[bl];
}

/** Reapply the original word's capitalization to the corrected word. */
function matchCase(original: string, corrected: string): string {
  if (original === original.toUpperCase() && original.length > 1) {
    return corrected.toUpperCase();
  }
  if (original[0] === original[0]?.toUpperCase()) {
    return corrected.charAt(0).toUpperCase() + corrected.slice(1);
  }
  return corrected;
}

/**
 * Correct likely-misspelled words against the domain vocabulary. Conservative:
 * only replaces a word when a close vocab match exists (same first letter,
 * small edit distance relative to length) so normal text is left untouched.
 */
export function correctSpelling(input: string, language: Language = "en"): string {
  const { en, fil } = buildVocab();
  const vocab = language === "fil" ? fil : en;

  return input.replace(/[A-Za-z]+/g, (word) => {
    const lower = word.toLowerCase();
    if (lower.length < 4 || vocab.has(lower)) return word; // already valid/short

    const maxDist = lower.length >= 8 ? 2 : 1;
    let best: string | null = null;
    let bestDist = maxDist + 1;

    for (const candidate of vocab) {
      // Cheap pre-filters: first letter + similar length.
      if (candidate[0] !== lower[0]) continue;
      if (Math.abs(candidate.length - lower.length) > maxDist) continue;
      const d = editDistance(lower, candidate, maxDist);
      if (d < bestDist) {
        bestDist = d;
        best = candidate;
        if (d === 1) break; // good enough
      }
    }

    return best && bestDist <= maxDist ? matchCase(word, best) : word;
  });
}

export function simplify(input: string, language: Language = "en"): string {
  // Auto-correct spelling first, then simplify.
  let text = correctSpelling(input.trim(), language);
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

export function generateLocalResponses(language: Language = "en"): string[] {
  if (language === "fil") {
    return ["Oo", "Hindi", "Salamat", "Pakiulit po"];
  }
  return ["Yes", "No", "Thank you", "Please repeat"];
}
