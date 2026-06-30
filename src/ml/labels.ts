// Label-to-phrase mapping.
// These labels MUST match the class names used during training (training/config.json "labels").
// The order also matches the model output indices.

export const LABEL_TO_PHRASE: Record<string, string> = {
  'YES':               'Yes.',
  'NO':                'No.',
  'DEAF':              'I am Deaf.',
  'THANK YOU':         'Thank you.',
  'SLOW':              'Please speak slowly.',
  "DON'T UNDERSTAND":  "I don't understand.",
  'MARRIAGE LICENSE':  'I need a marriage license.',
};

export const MODEL_LABELS = Object.keys(LABEL_TO_PHRASE);
