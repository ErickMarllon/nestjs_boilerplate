import { EmailField } from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class EmailReqDto {
  @EmailField()
  @Transform(lowerCaseTransformer)
  email!: string;
}
