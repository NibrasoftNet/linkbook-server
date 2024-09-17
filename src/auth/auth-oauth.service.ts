import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { UsersService } from '../users/users.service';
import { LoginResponseType } from './types/login-response.type';
import { SessionService } from '../session/session.service';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SocialRegisterDto } from '../social/interfaces/social-register.dto';
import { FilesService } from '../files/files.service';
import { AuthService } from './auth.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Utils } from '../utils/utils';
import { RoleDto } from '../roles/dto/role.dto';
import { StatusesDto } from '../statuses/dto/statuses.dto';
import { SocialLoginDto } from '../social/interfaces/social-login.dto';
import { CreateFileDto } from '../files/dto/create-file.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { ActivateNotificationDto } from '../social/activate-notification.dto';
import { defaultAddress } from '../utils/constants';

@Injectable()
export class AuthOauthService {
  constructor(
    private usersService: UsersService,
    private sessionService: SessionService,
    private readonly authService: AuthService,
    private fileService: FilesService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async validateSocialRegister(
    authProvider: string,
    socialData: SocialRegisterDto,
  ): Promise<LoginResponseType> {
    const { email, photo } = socialData;
    const socialEmail = email?.toLowerCase();
    const role = {
      id: RoleEnum.USER,
    } as RoleDto;
    const status = {
      id: StatusEnum.ACTIVE,
    } as StatusesDto;

    const picture = photo
      ? await this.fileService.createFileFromUrl(photo)
      : null;
    const profilePhoto = picture
      ? new CreateFileDto({
          id: picture.id,
          path: picture?.path,
        })
      : null;
    // Attempt to restore a soft-deleted user by email
    const restoredUser =
      await this.usersService.restoreUserByEmail(socialEmail);
    const newUser = new CreateUserDto({
      email,
      role,
      status,
      photo: profilePhoto,
      firstName: socialData.firstName,
      lastName: socialData.lastName,
      provider: authProvider,
      socialId: socialData.id,
      address: {
        city: defaultAddress.city,
        country: defaultAddress.country,
        countryFlag: defaultAddress.countryFlag,
        latitude: defaultAddress.latitude,
        longitude: defaultAddress.longitude,
        street: defaultAddress.street,
      },
    });
    await Utils.validateDtoOrFail(newUser);

    // Use the restored user if available, otherwise create a new user
    const user = restoredUser
      ? restoredUser
      : await this.usersService.create(newUser);

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    const hash = Utils.createSessionHash();

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.authService.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken: refreshToken,
      token: jwtToken,
      tokenExpires: tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    };
  }

  async validateSocialLogin(
    authProvider: string,
    socialData: SocialLoginDto,
  ): Promise<LoginResponseType> {
    const socialEmail = socialData.email.toLowerCase();

    // Check if user already exists
    const user = await this.usersService.findOneOrFail({
      email: socialEmail,
    });

    // Check if user previously logged in using OAUTH
    const socialOAuthUser = await this.usersService.findOne({
      socialId: socialData.id,
      provider: authProvider,
    });

    // If previously logged in using email and password, replace it by OAuth
    if (!socialOAuthUser) {
      user.socialId = socialData.id;
      user.provider = authProvider;
      //await this.usersService.update(user.id, user);
    }
    const hash = Utils.createSessionHash();

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.authService.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken: refreshToken,
      token: jwtToken,
      tokenExpires: tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    };
  }

  async activate(
    userJwtPayload: JwtPayloadType,
    activateNotificationDto?: ActivateNotificationDto,
  ): Promise<LoginResponseType> {
    console.log('aqwxcvb', activateNotificationDto);
    const user = await this.usersService.findOne({
      id: userJwtPayload.id,
    });
    if (activateNotificationDto?.notificationsToken) {
      await this.usersService.update(user.id, {
        notificationsToken: activateNotificationDto.notificationsToken,
      });
    }
    const hash = Utils.createSessionHash();

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const {
      token: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.authService.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash: Utils.createSessionHash(),
    });
    return {
      refreshToken: refreshToken,
      token: jwtToken,
      tokenExpires: tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    };
  }
}
