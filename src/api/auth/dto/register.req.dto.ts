import {
  EmailField,
  StringField,
  StrongPasswordField,
} from '@/decorators/field.decorators';
import { capitalizeWordsTransformer } from '@/utils/transformers/capitalize-word-.Transformer';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class RegisterReqDto {
  @EmailField()
  @Transform(lowerCaseTransformer)
  email: string;

  @StrongPasswordField()
  password: string;

  @StringField()
  @Transform(capitalizeWordsTransformer)
  username: string;
}
