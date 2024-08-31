import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { ConfigModule } from '@nestjs/config';
import { AuthAppleController } from './auth-apple.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
})
export class AuthAppleModule {}
