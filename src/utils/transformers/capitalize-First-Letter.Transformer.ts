import { type TransformFnParams } from 'class-transformer';
import { capitalizeFirstLetter } from './capitalize-First-Letter';

export const capitalizeFirstLetterTransformer = (
  params: TransformFnParams,
): string => capitalizeFirstLetter(params.value);
