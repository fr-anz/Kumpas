import type { Phrase } from '../types/phrase';

export const PHRASES: Phrase[] = [
  // ── Emergency ──────────────────────────────────────────
  {
    id: 'e1', category: 'emergency', priority: 'urgent',
    title: 'I need help',
    text: 'I need help.',
    filipinoText: 'Kailangan ko ng tulong.',
  },
  {
    id: 'e2', category: 'emergency', priority: 'urgent',
    title: 'I am Deaf',
    text: 'I am Deaf. Please communicate with me via text or writing.',
    filipinoText: 'Ako ay Bingi. Makipag-usap sa akin sa pamamagitan ng pagsulat.',
  },
  {
    id: 'e3', category: 'emergency', priority: 'urgent',
    title: 'Call an ambulance',
    text: 'Please call an ambulance immediately.',
    filipinoText: 'Mangyaring tumawag ng ambulansya agad.',
  },
  {
    id: 'e4', category: 'emergency', priority: 'urgent',
    title: 'Call the police',
    text: 'Please call the police.',
    filipinoText: 'Mangyaring tumawag ng pulis.',
  },
  {
    id: 'e5', category: 'emergency', priority: 'urgent',
    title: 'Call my emergency contact',
    text: 'Please call my emergency contact.',
    filipinoText: 'Mangyaring tawagan ang aking emergency contact.',
  },
  {
    id: 'e6', category: 'emergency',
    title: 'I need a doctor',
    text: 'I need a doctor.',
    filipinoText: 'Kailangan ko ng doktor.',
  },

  // ── Health ─────────────────────────────────────────────
  {
    id: 'h1', category: 'health', priority: 'urgent',
    title: 'I am in pain',
    text: 'I am in pain.',
    filipinoText: 'Masakit ako.',
  },
  {
    id: 'h2', category: 'health',
    title: 'I feel dizzy',
    text: 'I feel dizzy.',
    filipinoText: 'Nahihilo ako.',
  },
  {
    id: 'h3', category: 'health',
    title: 'Where is the clinic?',
    text: 'Where is the clinic?',
    filipinoText: 'Nasaan ang klinika?',
  },
  {
    id: 'h4', category: 'health',
    title: 'I need medicine',
    text: 'I need medicine.',
    filipinoText: 'Kailangan ko ng gamot.',
  },
  {
    id: 'h5', category: 'health',
    title: 'I have diabetes',
    text: 'I have diabetes.',
    filipinoText: 'May diabetes ako.',
  },
  {
    id: 'h6', category: 'health',
    title: 'I have a heart condition',
    text: 'I have a heart condition.',
    filipinoText: 'May sakit ang aking puso.',
  },

  // ── Barangay ───────────────────────────────────────────
  {
    id: 'b1', category: 'barangay',
    title: 'Barangay certificate',
    text: 'I need a barangay certificate.',
    filipinoText: 'Kailangan ko ng barangay certificate.',
  },
  {
    id: 'b2', category: 'barangay',
    title: 'Where is the barangay hall?',
    text: 'Where is the barangay hall?',
    filipinoText: 'Nasaan ang barangay hall?',
  },
  {
    id: 'b3', category: 'barangay',
    title: 'I need to file a complaint',
    text: 'I need to file a complaint.',
    filipinoText: 'Gusto kong mag-file ng reklamo.',
  },
  {
    id: 'b4', category: 'barangay',
    title: 'Where do I pay?',
    text: 'Where do I pay?',
    filipinoText: 'Saan ako magbabayad?',
  },
  {
    id: 'b5', category: 'barangay',
    title: 'How long will this take?',
    text: 'How long will this take?',
    filipinoText: 'Gaano katagal ito?',
  },
  {
    id: 'b6', category: 'barangay',
    title: 'I need a marriage license',
    text: 'I need a marriage license.',
    filipinoText: 'Kailangan ko ng marriage license.',
  },

  // ── Transport ──────────────────────────────────────────
  {
    id: 't1', category: 'transport',
    title: 'Stop here please',
    text: 'Please stop here.',
    filipinoText: 'Dito na po, pakitigil.',
  },
  {
    id: 't2', category: 'transport',
    title: 'How much is the fare?',
    text: 'How much is the fare?',
    filipinoText: 'Magkano ang pamasahe?',
  },
  {
    id: 't3', category: 'transport',
    title: 'Tell me when we arrive',
    text: 'Please tell me when we arrive.',
    filipinoText: 'Sabihin mo kung kailan tayo darating.',
  },
  {
    id: 't4', category: 'transport',
    title: 'Where does this bus go?',
    text: 'Where does this bus go?',
    filipinoText: 'Saan pupunta ang bus na ito?',
  },
  {
    id: 't5', category: 'transport',
    title: 'I want to go to...',
    text: 'I want to go to this destination. Can you help me?',
    filipinoText: 'Gusto kong pumunta rito. Matutulungan mo ba ako?',
  },

  // ── School ─────────────────────────────────────────────
  {
    id: 's1', category: 'school',
    title: 'Please write it down',
    text: 'Can you please write it down?',
    filipinoText: 'Maaari mo bang isulat?',
  },
  {
    id: 's2', category: 'school',
    title: 'Please speak slowly',
    text: 'Please speak slowly.',
    filipinoText: 'Magsalita nang dahan-dahan.',
  },
  {
    id: 's3', category: 'school',
    title: "I don't understand",
    text: "I don't understand.",
    filipinoText: 'Hindi ko naiintindihan.',
  },
  {
    id: 's4', category: 'school',
    title: 'Can you repeat that?',
    text: 'Can you repeat that?',
    filipinoText: 'Maaari mo bang ulitin?',
  },
  {
    id: 's5', category: 'school',
    title: 'Where is the office?',
    text: 'Where is the office?',
    filipinoText: 'Nasaan ang opisina?',
  },

  // ── Basic ──────────────────────────────────────────────
  {
    id: 'ba1', category: 'basic',
    title: 'Thank you',
    text: 'Thank you.',
    filipinoText: 'Salamat.',
  },
  {
    id: 'ba2', category: 'basic',
    title: 'Yes',
    text: 'Yes.',
    filipinoText: 'Oo.',
  },
  {
    id: 'ba3', category: 'basic',
    title: 'No',
    text: 'No.',
    filipinoText: 'Hindi.',
  },
  {
    id: 'ba4', category: 'basic',
    title: 'Please wait',
    text: 'Please wait.',
    filipinoText: 'Mangyaring maghintay.',
  },
  {
    id: 'ba5', category: 'basic',
    title: 'How much does this cost?',
    text: 'How much does this cost?',
    filipinoText: 'Magkano ito?',
  },
  {
    id: 'ba6', category: 'basic',
    title: 'Where is the restroom?',
    text: 'Where is the restroom?',
    filipinoText: 'Nasaan ang CR?',
  },
  {
    id: 'ba7', category: 'basic',
    title: 'Good morning',
    text: 'Good morning.',
    filipinoText: 'Magandang umaga.',
  },
];

export function getPhraseById(id: string): Phrase | undefined {
  return PHRASES.find(p => p.id === id);
}

export function getPhrasesByCategory(category: string): Phrase[] {
  return PHRASES.filter(p => p.category === category);
}
