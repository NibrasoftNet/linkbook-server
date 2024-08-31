import { Module } from '@nestjs/common';

import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        accountSid: configService.get('sms.accountSid', { infer: true }),
        authToken: configService.get('sms.authToken', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
