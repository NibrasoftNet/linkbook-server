import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { SessionModule } from '../session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { FilesModule } from '../files/files.module';
import { AuthOauthService } from './auth-oauth.service';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    FilesModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    AuthOauthService,
  ],
  exports: [AuthService, AuthOauthService],
})
export class AuthModule {}
