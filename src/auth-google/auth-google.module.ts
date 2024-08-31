import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { OAuth2GoogleProvider } from './auth-google.provider';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  providers: [AuthGoogleService, OAuth2GoogleProvider],
  exports: [AuthGoogleService],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
