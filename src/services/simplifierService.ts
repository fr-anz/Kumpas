// ── Rule-based text simplifier ────────────────────────────
// Converts complex staff/government messages into plain, clear text.
// No API required — works fully offline.

type Replacement = [RegExp, string];

const REPLACEMENTS: Replacement[] = [
  // Passive → active
  [/is being processed/gi, 'is not ready yet'],
  [/will be processed/gi, 'will be ready soon'],
  [/has been submitted/gi, 'was submitted'],
  [/are required to/gi, 'must'],
  [/it is required that you/gi, 'you must'],
  [/in accordance with/gi, 'following'],
  [/pursuant to/gi, 'under'],
  [/as per/gi, 'according to'],
  [/in lieu of/gi, 'instead of'],
  [/henceforth/gi, 'from now on'],
  [/aforementioned/gi, 'the mentioned'],
  [/at your earliest convenience/gi, 'as soon as possible'],
  [/kindly be advised that/gi, 'please note:'],
  [/please be informed that/gi, 'please note:'],
  [/we regret to inform you/gi, 'unfortunately,'],
  [/at this point in time/gi, 'now'],
  [/in the event that/gi, 'if'],
  [/for the purpose of/gi, 'to'],
  [/due to the fact that/gi, 'because'],
  [/in order to/gi, 'to'],
  [/with regard to/gi, 'about'],
  [/subsequent to/gi, 'after'],
  [/prior to/gi, 'before'],
  [/approximately/gi, 'about'],
  [/utilize/gi, 'use'],
  [/commence/gi, 'start'],
  [/terminate/gi, 'end'],
  [/obtain/gi, 'get'],
  [/provide/gi, 'give'],
  [/additional/gi, 'extra'],
  [/sufficient/gi, 'enough'],
  [/requirement/gi, 'requirement'],
  // Break very long sentences at conjunctions
  [/ however,/gi, '. However,'],
  [/ therefore,/gi, '. Therefore,'],
  [/ furthermore,/gi, '. Also,'],
  [/ moreover,/gi, '. Also,'],
  [/ nevertheless,/gi, '. But,'],
  [/ in addition,/gi, '. Also,'],
];

export function simplifyText(input: string): string {
  let result = input.trim();
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  // Trim double spaces
  result = result.replace(/  +/g, ' ').trim();
  // Ensure it ends with a period
  if (result && !/[.!?]$/.test(result)) result += '.';
  return result;
}

export function suggestedPhraseIds(input: string): string[] {
  const lower = input.toLowerCase();
  const suggestions: string[] = [];
  if (/help|tulong|assist/i.test(lower)) suggestions.push('e1');
  if (/deaf|bingi|hear/i.test(lower)) suggestions.push('e2');
  if (/pain|hurt|sakit|sick|ill/i.test(lower)) suggestions.push('h1');
  if (/doctor|doktor|clinic|klinika/i.test(lower)) suggestions.push('h3');
  if (/wait|hintay/i.test(lower)) suggestions.push('ba4');
  if (/barangay|certificate/i.test(lower)) suggestions.push('b1');
  if (/slow|dahan/i.test(lower)) suggestions.push('s2');
  if (/write|isulat/i.test(lower)) suggestions.push('s1');
  if (/understand|intindi/i.test(lower)) suggestions.push('s3');
  if (/how much|magkano|cost|fare|pamasahe/i.test(lower)) suggestions.push('ba5', 't2');
  return [...new Set(suggestions)].slice(0, 3);
}
