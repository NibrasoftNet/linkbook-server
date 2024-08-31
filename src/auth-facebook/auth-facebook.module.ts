import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { OAuth2FacebookProvider } from './auth-facebook.provider';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  providers: [AuthFacebookService, OAuth2FacebookProvider],
  exports: [AuthFacebookService],
  controllers: [AuthFacebookController],
})
export class AuthFacebookModule {}
