import type { Phrase } from "@/types/phrase";

/**
 * Local, offline-first phrase library. No network access required.
 * Each phrase carries English and Filipino (Tagalog) text. Urgent phrases are
 * flagged so the UI can emphasize them.
 */
export const phrases: Phrase[] = [
  // Emergency
  {
    id: "i-am-deaf",
    category: "emergency",
    title: "I am Deaf",
    text: "I am Deaf.",
    titleFil: "Bingi ako",
    textFil: "Bingi ako.",
    offlineAvailable: true,
    priority: "urgent",
  },
  {
    id: "i-need-help",
    category: "emergency",
    title: "I need help",
    text: "I need help.",
    titleFil: "Kailangan ko ng tulong",
    textFil: "Kailangan ko ng tulong.",
    offlineAvailable: true,
    priority: "urgent",
  },
  {
    id: "call-emergency-contact",
    category: "emergency",
    title: "Call my emergency contact",
    text: "Please call my emergency contact.",
    titleFil: "Tawagan ang aking emergency contact",
    textFil: "Pakitawagan ang aking emergency contact.",
    offlineAvailable: true,
    priority: "urgent",
  },
  {
    id: "please-write-it-down",
    category: "emergency",
    title: "Please write it down",
    text: "Please write it down.",
    titleFil: "Pakisulat",
    textFil: "Pakisulat na lang.",
    offlineAvailable: true,
  },

  // Health
  {
    id: "need-medical-assistance",
    category: "health",
    title: "I need medical assistance",
    text: "I need medical assistance.",
    titleFil: "Kailangan ko ng tulong medikal",
    textFil: "Kailangan ko ng tulong medikal.",
    offlineAvailable: true,
    priority: "urgent",
  },
  {
    id: "where-is-the-clinic",
    category: "health",
    title: "Where is the clinic?",
    text: "Where is the clinic?",
    titleFil: "Nasaan ang klinika?",
    textFil: "Nasaan ang klinika?",
    offlineAvailable: true,
  },
  {
    id: "i-feel-dizzy",
    category: "health",
    title: "I feel dizzy",
    text: "I feel dizzy.",
    titleFil: "Nahihilo ako",
    textFil: "Nahihilo ako.",
    offlineAvailable: true,
  },
  {
    id: "i-am-in-pain",
    category: "health",
    title: "I am in pain",
    text: "I am in pain.",
    titleFil: "Masakit ang pakiramdam ko",
    textFil: "Masakit ang pakiramdam ko.",
    offlineAvailable: true,
    priority: "urgent",
  },

  // Barangay
  {
    id: "need-barangay-certificate",
    category: "barangay",
    title: "I need a barangay certificate",
    text: "I need a barangay certificate.",
    titleFil: "Kailangan ko ng barangay certificate",
    textFil: "Kailangan ko ng barangay certificate.",
    offlineAvailable: true,
  },
  {
    id: "where-should-i-go",
    category: "barangay",
    title: "Where should I go?",
    text: "Where should I go?",
    titleFil: "Saan ako pupunta?",
    textFil: "Saan ako dapat pumunta?",
    offlineAvailable: true,
  },

  // Transportation
  {
    id: "tell-me-when-we-arrive",
    category: "transportation",
    title: "Tell me when we arrive",
    text: "Please tell me when we arrive.",
    titleFil: "Sabihin kung dumating na",
    textFil: "Pakisabi kung dumating na tayo.",
    offlineAvailable: true,
  },
  {
    id: "how-much-should-i-pay",
    category: "transportation",
    title: "How much should I pay?",
    text: "How much should I pay?",
    titleFil: "Magkano ang babayaran ko?",
    textFil: "Magkano ang babayaran ko?",
    offlineAvailable: true,
  },

  // School
  {
    id: "please-wait",
    category: "school",
    title: "Please wait",
    text: "Please wait.",
    titleFil: "Pakihintay",
    textFil: "Pakihintay lang.",
    offlineAvailable: true,
  },
  {
    id: "where-is-my-classroom",
    category: "school",
    title: "Where is my classroom?",
    text: "Where is my classroom?",
    titleFil: "Nasaan ang aking silid-aralan?",
    textFil: "Nasaan ang aking silid-aralan?",
    offlineAvailable: true,
  },

  // Basic Needs
  {
    id: "thank-you",
    category: "basic",
    title: "Thank you",
    text: "Thank you.",
    titleFil: "Salamat",
    textFil: "Salamat.",
    offlineAvailable: true,
  },
  {
    id: "yes",
    category: "basic",
    title: "Yes",
    text: "Yes.",
    titleFil: "Oo",
    textFil: "Oo.",
    offlineAvailable: true,
  },
  {
    id: "no",
    category: "basic",
    title: "No",
    text: "No.",
    titleFil: "Hindi",
    textFil: "Hindi.",
    offlineAvailable: true,
  },
  {
    id: "i-dont-understand",
    category: "basic",
    title: "I don't understand",
    text: "I don't understand.",
    titleFil: "Hindi ko maintindihan",
    textFil: "Hindi ko maintindihan.",
    offlineAvailable: true,
  },
  {
    id: "please-slow-down",
    category: "basic",
    title: "Please slow down",
    text: "Please slow down.",
    titleFil: "Pakibagalan",
    textFil: "Pakibagalan ang pagsasalita.",
    offlineAvailable: true,
  },

  // Barangay civic documents (matching trained FSL signs)
  {
    id: "need-barangay-clearance",
    category: "barangay",
    title: "I need a barangay clearance",
    text: "I need a barangay clearance.",
    titleFil: "Kailangan ko ng barangay clearance",
    textFil: "Kailangan ko ng barangay clearance.",
    offlineAvailable: true,
  },
  {
    id: "need-cedula",
    category: "barangay",
    title: "I need a cedula",
    text: "I need a cedula (community tax certificate).",
    titleFil: "Kailangan ko ng cedula",
    textFil: "Kailangan ko ng cedula.",
    offlineAvailable: true,
  },
  {
    id: "need-certificate-indigency",
    category: "barangay",
    title: "I need a certificate of indigency",
    text: "I need a certificate of indigency.",
    titleFil: "Kailangan ko ng certificate of indigency",
    textFil: "Kailangan ko ng certificate of indigency.",
    offlineAvailable: true,
  },
  {
    id: "need-certificate-residency",
    category: "barangay",
    title: "I need a certificate of residency",
    text: "I need a certificate of residency.",
    titleFil: "Kailangan ko ng certificate of residency",
    textFil: "Kailangan ko ng certificate of residency.",
    offlineAvailable: true,
  },
  {
    id: "file-blotter-report",
    category: "barangay",
    title: "I need to file a blotter report",
    text: "I need to file a blotter report.",
    titleFil: "Gusto kong mag-file ng blotter report",
    textFil: "Gusto kong mag-file ng blotter report.",
    offlineAvailable: true,
  },
  {
    id: "need-marriage-license",
    category: "barangay",
    title: "I need a marriage license",
    text: "I need a marriage license.",
    titleFil: "Kailangan ko ng marriage license",
    textFil: "Kailangan ko ng marriage license.",
    offlineAvailable: true,
  },
  {
    id: "asking-for-ayuda",
    category: "barangay",
    title: "I am asking for assistance",
    text: "I am asking for assistance (ayuda).",
    titleFil: "Humihingi ako ng ayuda",
    textFil: "Humihingi ako ng ayuda.",
    offlineAvailable: true,
  },
];


export function getPhraseById(id: string): Phrase | undefined {
  return phrases.find((phrase) => phrase.id === id);
}

export function getPhrasesByCategory(category: string): Phrase[] {
  return phrases.filter((phrase) => phrase.category === category);
}
