import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthOauthService } from '../auth/auth-oauth.service';
import { SocialRegisterDto } from '../social/interfaces/social-register.dto';
import { SocialLoginDto } from '../social/interfaces/social-login.dto';

@ApiTags('Twitter OAuth')
@Controller({
  path: 'auth/twitter',
  version: '1',
})
export class AuthTwitterController {
  constructor(private readonly oAuthService: AuthOauthService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() socialData: SocialRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('twitter', socialData);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('twitter', socialData);
  }
}
