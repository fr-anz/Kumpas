export type Category =
  | 'emergency'
  | 'health'
  | 'barangay'
  | 'transport'
  | 'school'
  | 'basic';

export type Phrase = {
  id: string;
  category: Category;
  title: string;        // Short English label shown on cards
  text: string;         // Full English sentence spoken aloud
  filipinoText: string; // Filipino translation shown prominently
  priority?: 'urgent' | 'normal';
};
