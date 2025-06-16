import { EmailField, PasswordField } from '@/decorators/field.decorators';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class LoginReqDto {
  @EmailField()
  @Transform(lowerCaseTransformer)
  email!: string;

  @PasswordField({
    example: '123456',
  })
  password!: string;
}
