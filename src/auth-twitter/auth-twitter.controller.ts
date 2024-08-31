import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthTwitterService } from './auth-twitter.service';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthOauthService } from '../auth/auth-oauth.service';

@ApiTags('Twitter OAuth')
@Controller({
  path: 'auth/twitter',
  version: '1',
})
export class AuthTwitterController {
  constructor(
    private readonly oAuthService: AuthOauthService,
    private readonly authTwitterService: AuthTwitterService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() loginDto: AuthTwitterLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    return await this.authTwitterService.getProfileByToken(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('twitter', socialData);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('twitter', socialData);
  }
}
