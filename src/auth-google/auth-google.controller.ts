import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthOauthService } from '../auth/auth-oauth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UsersService } from '../users/users.service';
import { OAuthGoogleResponseDto } from './dto/oAuth-google-response.dto';
import { SocialRegisterDto } from '../social/interfaces/social-register.dto';
import { SocialLoginDto } from '../social/interfaces/social-login.dto';
import { Response } from 'express';
import { AllConfigType } from '../config/config.type';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponseType } from '../auth/types/login-response.type';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { ActivateNotificationDto } from '../social/activate-notification.dto';

@ApiTags('Google OAuth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly oAuthService: AuthOauthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @Get()
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CurrentUser() user: OAuthGoogleResponseDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const existUser = await this.usersService.findOne({
      email: user.emails[0].value,
    });
    if (!existUser) {
      const { id, emails, photos, ...filteredUserDetails } = user;
      const newUser = new SocialRegisterDto({
        id,
        email: emails[0].value,
        photo: photos ? photos[0].value : null,
        firstName: filteredUserDetails.name.givenName,
        lastName: filteredUserDetails.name.familyName,
      });
      const registeredUser = await this.oAuthService.validateSocialRegister(
        'google',
        newUser,
      );
      response.redirect(
        `${this.configService.getOrThrow('app.frontendDomain', { infer: true })}/redirect?token=${registeredUser.token}`,
      );
    }
    const loginDto = new SocialLoginDto({
      id: user.id,
      email: user.emails[0].value,
    });
    const loggedUser = await this.oAuthService.validateSocialLogin(
      'google',
      loginDto,
    );
    response.redirect(
      `${this.configService.getOrThrow('app.frontendDomain', { infer: true })}/redirect?token=${loggedUser.token}`,
    );
  }

  @ApiBearerAuth()
  @Put('activate')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async activate(
    @Request() request,
    @Body() activateNotificationDto: ActivateNotificationDto,
  ): Promise<LoginResponseType> {
    try {
      return await this.oAuthService.activate(
        request.user,
        activateNotificationDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
