import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { AuthOauthService } from '../auth/auth-oauth.service';

@ApiTags('Google OAuth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly oAuthService: AuthOauthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @Body() loginDto: AuthGoogleLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    return await this.authGoogleService.getProfileByToken(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialRegister('google', socialData);
  }

  @Post('mobile-register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialMobileRegister(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialMobileRegister('google', socialData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async validateSocialLogin(
    @Body() socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    return this.oAuthService.validateSocialLogin('google', socialData);
  }
}
