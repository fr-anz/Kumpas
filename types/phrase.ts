/** A communication phrase available offline in the library. */
export type PhraseCategory =
  | "emergency"
  | "health"
  | "barangay"
  | "transportation"
  | "school"
  | "basic";

export type Phrase = {
  id: string;
  category: PhraseCategory;
  title: string;
  text: string;
  /** Filipino title and spoken text. */
  titleFil: string;
  textFil: string;
  simplifiedText?: string;
  /** Explicit FSL image URL (optional). Overrides convention-based lookup. */
  fslVisualUrl?: string;
  /** Explicit ASL fallback image URL (optional). */
  aslVisualUrl?: string;
  offlineAvailable: boolean;
  priority?: "normal" | "urgent";
};
