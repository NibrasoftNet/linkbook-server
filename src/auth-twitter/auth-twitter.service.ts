import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twitter from 'twitter';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';
import { AllConfigType } from '../config/config.type';
import { UsersService } from '../users/users.service';
import { defaultAddress } from '../utils/constants';

@Injectable()
export class AuthTwitterService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly usersService: UsersService,
  ) {}

  async getProfileByToken(
    loginDto: AuthTwitterLoginDto,
  ): Promise<SocialLoginRegisterDto> {
    const twitter = new Twitter({
      consumer_key: this.configService.getOrThrow('twitter.consumerKey', {
        infer: true,
      }),
      consumer_secret: this.configService.getOrThrow('twitter.consumerSecret', {
        infer: true,
      }),
      access_token_key: loginDto.accessTokenKey,
      access_token_secret: loginDto.accessTokenSecret,
    });

    const data: Twitter.ResponseData = await new Promise((resolve) => {
      twitter.get(
        'account/verify_credentials',
        { include_email: true },
        (error, profile) => {
          resolve(profile);
        },
      );
    });

    const user = await this.usersService.findOne({
      email: data.email,
    });

    return {
      id: data.id?.toString(),
      email: data.email,
      firstName: data.name,
      phone: data.phone,
      picture: data.picture,
      address: defaultAddress,
      isNewUser: !user,
    };
  }
}
