import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
import { AuthOauthService } from '../auth/auth-oauth.service';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';

@ApiTags('Facebook OAuth')
@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    private readonly oAuthService: AuthOauthService,
    private readonly authFacebookService: AuthFacebookService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() loginDto: AuthFacebookLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    return await this.authFacebookService.getProfileByToken(loginDto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('facebook', socialData);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('facebook', socialData);
  }
}
