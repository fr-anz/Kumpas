/**
 * Step-by-step FSL instructions per phrase, rendered as an instructional
 * visual when no FSL/ASL image file is present. Descriptions come from the
 * project's sign references. Each step may carry a short component label
 * (e.g. "I", "DEAF") plus the movement instruction, in English and Filipino.
 */

export type SignStep = {
  /** Optional short gloss/component label, e.g. "I", "DEAF". */
  label?: string;
  en: string;
  fil: string;
};

export type SignGuide = {
  /** Source sign language for these steps. */
  variant: "FSL" | "ASL";
  steps: SignStep[];
};

export const signSteps: Record<string, SignGuide> = {
  "i-am-deaf": {
    variant: "FSL",
    steps: [
      {
        label: "I",
        en: "Point your index finger to your chest.",
        fil: "Ituro ang iyong hintuturo sa iyong dibdib.",
      },
      {
        label: "DEAF",
        en: "Tap your right index finger on your earlobe, then tap it near the corner of your right eye.",
        fil: "I-tap ang kanang hintuturo sa iyong tainga, pagkatapos ay i-tap malapit sa gilid ng iyong kanang mata.",
      },
    ],
  },
  "i-need-help": {
    variant: "FSL",
    steps: [
      {
        label: "I",
        en: "Point your dominant index finger directly at your own chest.",
        fil: "Ituro ang iyong dominanteng hintuturo nang diretso sa iyong dibdib.",
      },
      {
        label: "NEED",
        en: "Form an 'X' with your dominant hand (curl your index finger like a hook) and tap it against your chin once or twice.",
        fil: "Bumuo ng 'X' gamit ang dominanteng kamay (ikurba ang hintuturo parang kawit) at i-tap ito sa iyong baba nang isa o dalawang beses.",
      },
      {
        label: "HELP",
        en: "Make a thumbs-up ('A' handshape) and place it on your flat, open other palm, then lift both hands slightly upward together.",
        fil: "Gumawa ng thumbs-up ('A' handshape) at ilagay ito sa iyong nakabukas na kabilang palad, pagkatapos ay itaas nang bahagya ang dalawang kamay nang magkasama.",
      },
    ],
  },
  "call-emergency-contact": {
    variant: "FSL",
    steps: [
      {
        label: "CALL",
        en: "Make a 'Y' handshape (thumb and pinky out, other fingers folded), place it near your ear or cheek, then move slightly outward.",
        fil: "Gumawa ng 'Y' handshape (nakalabas ang hinlalaki at hinliliit), ilagay malapit sa tainga o pisngi, pagkatapos ay bahagyang igalaw palabas.",
      },
      {
        label: "MY",
        en: "Place your open, flat palm against the center of your chest.",
        fil: "Ilagay ang iyong nakabukas na palad sa gitna ng iyong dibdib.",
      },
      {
        label: "EMERGENCY",
        en: "Tap the tip of your index finger on the side of your neck.",
        fil: "I-tap ang dulo ng iyong hintuturo sa gilid ng iyong leeg.",
      },
      {
        label: "CONTACT",
        en: "With both hands, pinch index finger and thumb together ('F' handshape) and tap the fingertips together.",
        fil: "Gamit ang dalawang kamay, pagdikitin ang hintuturo at hinlalaki ('F' handshape) at pagtapikin ang mga dulo ng daliri.",
      },
    ],
  },
};

export function getSignGuide(phraseId: string): SignGuide | undefined {
  return signSteps[phraseId];
}
