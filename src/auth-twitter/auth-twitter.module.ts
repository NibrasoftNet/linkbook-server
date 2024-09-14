import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthTwitterController } from './auth-twitter.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [AuthTwitterController],
})
export class AuthTwitterModule {}
