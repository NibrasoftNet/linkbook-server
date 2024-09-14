import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OAuth2FacebookProvider } from './auth-facebook.provider';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  providers: [OAuth2FacebookProvider],
  controllers: [AuthFacebookController],
})
export class AuthFacebookModule {}
