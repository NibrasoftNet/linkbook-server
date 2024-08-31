import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthOauthService } from '../auth/auth-oauth.service';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';

@ApiTags('Apple OAuth')
@Controller({
  path: 'auth/apple',
  version: '1',
})
export class AuthAppleController {
  constructor(
    private readonly oAuthService: AuthOauthService,
    private readonly authAppleService: AuthAppleService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() loginDto: AuthAppleLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    return await this.authAppleService.getProfileByToken(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async validateSocialRegister(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('apple', socialData);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('apple', socialData);
  }
}
