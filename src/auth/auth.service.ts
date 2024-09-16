import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { plainToClass } from 'class-transformer';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseType } from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { SessionService } from '../session/session.service';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { Session } from '../session/entities/session.entity';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { UserDto } from '../users/dto/user.dto';

import {
  runOnTransactionComplete,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { StatusesDto } from '../statuses/dto/statuses.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { Status } from '../statuses/entities/status.entity';
import { Utils } from '../utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private otpService: OtpService,
    private configService: ConfigService<AllConfigType>,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });
    if (!user) {
      throw new UnauthorizedException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException(
        `{"email": "${this.i18n.t('auth.loggedWithSocial', { lang: I18nContext.current()?.lang })}:${user.provider}"}`,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException(
        `{"password": "${this.i18n.t('auth.invalidPassword', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    if (user.status?.id === StatusEnum.INACTIVE) {
      await this.sendConfirmEmail(user.email);
      throw new ForbiddenException(
        `{"email": "${this.i18n.t('auth.emailNotConfirmed', { lang: I18nContext.current()?.lang })}"}`,
        {},
      );
    }

    if (loginDto.notificationsToken) {
      await this.usersService.update(user.id, {
        notificationsToken: loginDto.notificationsToken,
      });
    }

    const hash = Utils.createSessionHash();

    const session = await this.sessionService.create({
      user,
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken: refreshToken,
      token: token,
      tokenExpires: tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<boolean> {
    // Attempt to restore a soft-deleted user by email
    const restoredUser = await this.usersService.restoreUserByEmail(dto.email);

    const user = restoredUser
      ? restoredUser
      : await this.usersService.create({
          ...dto,
          email: dto.email,
          role: {
            id: RoleEnum.USER,
          } as RoleDto,
          status: {
            id: StatusEnum.ACTIVE,
          } as StatusesDto,
        });
    await this.sendConfirmEmail(user.email);
    return true;
  }

  async confirmEmail(confirmOtpEmailDto: ConfirmOtpEmailDto): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto);
    const user = await this.usersService.findOne({
      email: confirmOtpEmailDto.email,
    });

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    user.status = plainToClass(Status, {
      id: StatusEnum.ACTIVE,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new UnprocessableEntityException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
      );
    }
    await this.sendForgetPasswordEmail(email);
  }

  async resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    user.password = resetPasswordDto.password;

    await this.sessionService.softDelete({
      user: {
        id: user.id,
      },
    });
    await user.save();
  }

  async me(
    userJwtPayload: JwtPayloadType,
    notificationToken?: string,
  ): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      id: userJwtPayload.id,
    });
    if (notificationToken) {
      await this.usersService.update(user.id, {
        notificationsToken: notificationToken,
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
    } = await this.getTokensData({
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

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<User>> {
    return await this.usersService.update(
      userJwtPayload.id,
      updateUserDto,
      files,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const isValidPassword = await bcrypt.compare(
      newPasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException(
        `{"password": "${this.i18n.t('auth.invalidPassword', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    await this.usersService.update(userJwtPayload.id, {
      password: newPasswordDto.newPassword,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<LoginResponseType> {
    const session = await this.sessionService.findOne(
      {
        where: {
          id: data.sessionId,
        },
      },
      {
        user: true,
      },
    );

    if (!session) {
      throw new UnauthorizedException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
      );
    }

    const hash = Utils.createSessionHash();

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(session.user, User, UserDto),
    };
  }

  @Transactional()
  async softDelete(user: User): Promise<void> {
    runOnTransactionRollback(() =>
      console.log(`Account Deletion transaction rolled back`),
    );
    runOnTransactionComplete((error) => {
      if (!!error) {
        console.log(`Account Deletion transaction failed`);
      }
      console.log(`Account Deletion transaction completed`);
    });

    // Delete user sessions
    await this.sessionService.softDelete({ user });
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  async sendConfirmEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.userSignUp({
      to: email,
      data: {
        otp,
      },
    });
  }

  async sendForgetPasswordEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.forgotPassword({
      to: email,
      data: {
        otp,
      },
    });
  }

  async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
