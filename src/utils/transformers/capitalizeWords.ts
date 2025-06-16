import { capitalizeFirstLetter } from './capitalize-First-Letter';

export const capitalizeWords = (str?: string): string => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
};
