import { Module } from '@nestjs/common';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from '../auth/strategies/google.strategy';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [AuthGoogleController],
  providers: [GoogleStrategy],
})
export class AuthGoogleModule {}
