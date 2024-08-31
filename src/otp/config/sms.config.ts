import { registerAs } from '@nestjs/config';
import { SmsConfig } from './sms-config.type';
import { IsString, IsOptional } from 'class-validator';
import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  @IsOptional()
  TWILIO_AUTH_TOKEN: string;
}

export default registerAs<SmsConfig>('sms', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  };
});
