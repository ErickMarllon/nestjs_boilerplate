import {
  EmailField,
  PasswordField,
  TokenField,
} from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class ForgotReqDto {
  @EmailField()
  @Transform(lowerCaseTransformer)
  email!: string;
}
export class ForgotTokenReqDto {
  @TokenField()
  token: string;
}
export class ForgotResetReqDto extends ForgotTokenReqDto {
  @PasswordField()
  password!: string;
}
