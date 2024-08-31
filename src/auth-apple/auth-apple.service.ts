import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import appleSigninAuth, { AppleIdTokenType } from 'apple-signin-auth';
import { ConfigService } from '@nestjs/config';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { AllConfigType } from '../config/config.type';
import { defaultAddress } from '../utils/constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthAppleService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
  ) {}

  async getProfileByToken(
    loginDto: AuthAppleLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    const data: AppleIdTokenType = await appleSigninAuth.verifyIdToken(
      loginDto.idToken,
      {
        audience: this.configService.get('apple.appAudience', { infer: true }),
      },
    );
    if (!data || !data.email) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        errors: {
          user: 'wrongToken',
        },
      });
    }

    const user = await this.usersService.findOne({
      email: data.email,
    });

    return {
      id: data.sub,
      email: data.email,
      firstName: loginDto.firstName,
      lastName: loginDto.lastName,
      address: defaultAddress,
      isNewUser: !user,
    };
  }
}
