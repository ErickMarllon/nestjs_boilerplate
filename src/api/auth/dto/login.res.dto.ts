import {
  BooleanField,
  NumberField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginResDto {
  @Expose()
  @StringField()
  userId!: string;

  @StringField()
  @Expose()
  username: string;

  @StringField()
  @Expose()
  email: string;

  @StringFieldOptional()
  @Expose()
  bio?: string;

  @StringField()
  @Expose()
  image: string;

  @BooleanField()
  @Expose()
  isEmailVerified: boolean;

  @Expose()
  @StringField()
  accessToken!: string;

  @Expose()
  @StringField()
  refreshToken!: string;

  @Expose()
  @NumberField()
  tokenExpires!: number;
}
