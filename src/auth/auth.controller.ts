import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Request,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { ConfirmOtpEmailDto } from '../otp/dto/confirm-otp-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { User } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { UserDto } from '../users/dto/user.dto';
import { Mapper } from 'automapper-core';
import { AuthNewPasswordDto } from './dto/auth-new-password.dto';
import { CreateDonationDto } from '../donation/dto/create-donation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    try {
      return await this.service.validateLogin(loginDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('email/login/mobile')
  @HttpCode(HttpStatus.OK)
  public async mobileLogin(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    try {
      return await this.service.mobileLogin(loginDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: AuthRegisterLoginDto,
  ): Promise<boolean> {
    try {
      return await this.service.register(createUserDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    try {
      return await this.service.confirmEmail(confirmOtpEmailDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    try {
      return await this.service.forgotPassword(forgotPasswordDto.email);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    try {
      return await this.service.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  public async me(@Request() request): Promise<NullableType<User>> {
    try {
      return await this.service.me(request.user);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@Request() request): Promise<LoginResponseType> {
    try {
      return await this.service.refreshToken({
        sessionId: request.user.sessionId,
      });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request): Promise<void> {
    try {
      await this.service.logout({
        sessionId: request.user.sessionId,
      });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(AuthUpdateDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateDonationDto),
        },
      },
    },
  })
  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  @UseInterceptors(FileInterceptor('files'))
  public async update(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<User>> {
    try {
      const updateUserDto = new AuthUpdateDto(data);
      await Utils.validateDtoOrFail(updateUserDto);
      return await this.service.update(request.user, updateUserDto, files);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiBearerAuth()
  @Put('new-password/me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    try {
      return await this.service.newPassword(request.user, newPasswordDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request): Promise<void> {
    try {
      return await this.service.softDelete(request.user);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
