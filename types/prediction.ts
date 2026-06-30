/** A single sign-recognition result mapped to a usable phrase. */
export type Prediction = {
  label: string;
  phrase: string;
  confidence: number;
};
