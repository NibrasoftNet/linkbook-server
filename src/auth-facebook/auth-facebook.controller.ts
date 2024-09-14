import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthOauthService } from '../auth/auth-oauth.service';
import { SocialRegisterDto } from '../social/interfaces/social-register.dto';
import { SocialLoginDto } from '../social/interfaces/social-login.dto';

@ApiTags('Facebook OAuth')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(private readonly oAuthService: AuthOauthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() socialData: SocialRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('facebook', socialData);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('facebook', socialData);
  }
}
