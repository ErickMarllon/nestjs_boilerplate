import {
  EmailField,
  PasswordField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { capitalizeWordsTransformer } from '@/utils/transformers/capitalize-word-.Transformer';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField()
  @Transform(capitalizeWordsTransformer)
  username: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @StringFieldOptional()
  bio?: string;

  @StringFieldOptional()
  image?: string;
}
