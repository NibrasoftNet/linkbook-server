import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AllConfigType } from '../config/config.type';
import { defaultAddress } from '../utils/constants';
import { UsersService } from '../users/users.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthGoogleService {
  private readonly google: OAuth2Client;
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
    @Inject('OAuth2GoogleClient') google: OAuth2Client,
  ) {
    this.google = google;
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [
        this.configService.getOrThrow('google.clientId', { infer: true }),
      ],
    });
    const data = ticket.getPayload() as TokenPayload;
    if (!data || !data.email) {
      throw new UnprocessableEntityException(
        `{"email":${this.i18n.t('auth.wrongToken', { lang: I18nContext.current()?.lang })}}`,
      );
    }

    const user = await this.usersService.findOne({
      email: data.email,
    });
    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      picture: data.picture,
      address: defaultAddress,
      isNewUser: !user,
    };
  }
}
