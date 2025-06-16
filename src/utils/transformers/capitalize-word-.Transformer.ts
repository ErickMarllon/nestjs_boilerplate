import { type TransformFnParams } from 'class-transformer';
import { capitalizeFirstLetter } from './capitalize-First-Letter';

export const capitalizeWordsTransformer = (str?: TransformFnParams): string => {
  if (!str) return '';
  const { value } = str;
  if (typeof value !== 'string') return '';

  return value
    .split(' ')
    .map((word) => (word.length > 2 ? capitalizeFirstLetter(word) : word))
    .join(' ');
};
