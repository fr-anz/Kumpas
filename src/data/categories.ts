import type { Category } from '../types/phrase';

export type CategoryMeta = {
  id: Category;
  label: string;
  emoji: string;
  color: string;
  bg: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { id: 'emergency', label: 'Emergency',  emoji: '🚨', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'health',    label: 'Health',     emoji: '🏥', color: '#059669', bg: '#ECFDF5' },
  { id: 'barangay',  label: 'Barangay',   emoji: '🏛️', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'transport', label: 'Transport',  emoji: '🚌', color: '#D97706', bg: '#FFFBEB' },
  { id: 'school',    label: 'School',     emoji: '📚', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'basic',     label: 'Basic',      emoji: '💬', color: '#0D9488', bg: '#F0FDFA' },
];

export function getCategoryMeta(id: Category): CategoryMeta {
  return CATEGORIES.find(c => c.id === id) ?? CATEGORIES[5];
}
