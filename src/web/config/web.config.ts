import { registerAs } from '@nestjs/config';

import { IsNotEmpty, IsString } from 'class-validator';
import process from 'node:process';
import validateConfig from '../../utils/validate-config';
import { WebConfig } from './web-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  WEB_URL: string;
}

export default registerAs<WebConfig>('web', () => {
  console.info(`Register WebConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.WEB_URL,
  };
});
