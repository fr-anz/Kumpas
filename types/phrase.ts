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
  fslVisualUrl?: string;
  offlineAvailable: boolean;
  priority?: "normal" | "urgent";
};
