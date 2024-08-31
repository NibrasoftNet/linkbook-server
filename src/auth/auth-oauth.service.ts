import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { Status } from '../statuses/entities/status.entity';
import { Role } from '../roles/entities/role.entity';
import { UsersService } from '../users/users.service';
import { LoginResponseType } from './types/login-response.type';
import { SessionService } from '../session/session.service';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { UserDto } from '../users/dto/user.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { CreateUserDto } from '../users/dto/create-user.dto';
import crypto from 'crypto';
import { SocialLoginRegisterDto } from '../social/interfaces/social-login-register.dto';
import { FilesService } from '../files/files.service';
import { AuthService } from './auth.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

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
    socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    const socialEmail = socialData.email?.toLowerCase();

    const role = {
      id: RoleEnum.USER,
    } as Role;
    const status = {
      id: StatusEnum.ACTIVE,
    } as Status;
    const photo = socialData.picture
      ? await this.fileService.createFileFromUrl(socialData.picture)
      : null;

    // Attempt to restore a soft-deleted user by email
    const restoredUser =
      await this.usersService.restoreUserByEmail(socialEmail);

    const newUser = new CreateUserDto();
    newUser.email = socialEmail;
    newUser.firstName = socialData.firstName ?? 'prenom';
    newUser.lastName = socialData.lastName ?? 'nom';
    newUser.socialId = socialData.id;
    newUser.provider = authProvider;
    newUser.role = role;
    newUser.status = status;
    newUser.photo = photo;
    newUser.address = socialData.address;

    // Use the restored user if available, otherwise create a new user
    const user = restoredUser
      ? restoredUser
      : await this.usersService.create(newUser);

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

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

  async validateSocialMobileRegister(
    authProvider: string,
    socialData: SocialLoginRegisterDto,
  ): Promise<LoginResponseType> {
    const socialEmail = socialData.email?.toLowerCase();
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    let user = await this.usersService.findOne({ email: socialEmail });

    if (!user) {
      // Attempt to restore a soft-deleted user by email
      user = await this.usersService.restoreUserByEmail(socialEmail);
    }

    if (!user) {
      const role = {
        id: RoleEnum.USER,
      } as Role;
      const status = {
        id: StatusEnum.ACTIVE,
      } as Status;
      const photo = socialData.picture
        ? await this.fileService.createFileFromUrl(socialData.picture)
        : null;

      const newUser = new CreateUserDto();
      newUser.email = socialEmail;
      newUser.firstName = socialData.firstName ?? 'prenom';
      newUser.lastName = socialData.lastName ?? 'nom';
      newUser.socialId = socialData.id;
      newUser.provider = authProvider;
      newUser.role = role;
      newUser.status = status;
      newUser.photo = photo;
      newUser.address = socialData.address;

      // Use the restored user if available, otherwise create a new user
      user = await this.usersService.create(newUser);
    }

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

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
    socialData: SocialLoginRegisterDto,
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
      // await this.usersService.update(user.id, user);
    }
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

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
}
