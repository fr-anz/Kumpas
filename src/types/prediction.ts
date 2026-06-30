export type Prediction = {
  label: string;      // Model label e.g. "DEAF"
  phrase: string;     // Mapped phrase e.g. "I am Deaf."
  confidence: number; // 0–1
};
