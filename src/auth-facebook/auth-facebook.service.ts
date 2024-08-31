import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { FacebookInterface } from './interfaces/facebook.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from '../config/config.type';
import { defaultAddress } from '../utils/constants';
import { UsersService } from '../users/users.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthFacebookService {
  private fb: Facebook;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
    @Inject('OAuth2FacebookClient') fb: Facebook,
  ) {
    this.fb = fb;
  }

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    this.fb.setAccessToken(loginDto.accessToken);

    const data: FacebookInterface = await new Promise((resolve) => {
      this.fb.api(
        '/me',
        'GET',
        {
          fields: 'id,first_name,last_name,picture{url},email',
        },
        (response: FacebookInterface | PromiseLike<FacebookInterface>) => {
          resolve(response);
        },
      );
    });
    if (!data || !data.email) {
      throw new UnprocessableEntityException(
        `{"email":${this.i18n.t('auth.wrongToken', { lang: I18nContext.current()?.lang })}}`,
      );
    }

    const user = await this.usersService.findOne({
      email: data.email,
    });

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      picture: data.picture.data.url,
      address: defaultAddress,
      isNewUser: !user,
    };
  }
}
