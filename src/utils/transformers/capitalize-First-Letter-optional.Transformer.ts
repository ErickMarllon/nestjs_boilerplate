import { type TransformFnParams } from 'class-transformer';
import { capitalizeFirstLetter } from './capitalize-First-Letter';

export const capitalizeFirstLetterOptionalTransformer = (
  params: TransformFnParams,
): string | undefined => {
  if (params.value === undefined || params.value === null) return undefined;
  return capitalizeFirstLetter(params.value);
};
