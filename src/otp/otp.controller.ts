import { ConfirmOtpEmailDto } from './dto/confirm-otp-email.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiTags } from '@nestjs/swagger';
import { Otp } from './entities/otp.entity';
import { DeleteResult } from 'typeorm';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { CreateOtpDto } from './dto/create-otp.dto';
import { ResendVerifyOtpDto } from './dto/verifyotp.dto';
import { NullableType } from '../utils/types/nullable.type';
@ApiTags('Otp')
@Controller({
  path: 'otp',
  version: '1',
})
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /**
   * Create Otp
   * @returns {void}
   * @param createOtpDto
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<number> {
    try {
      return await this.otpService.createOtp(createOtpDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    try {
      await this.otpService.verifyOtp(confirmOtpEmailDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
  /**
   * Get all not confirmed otp
   * @returns {Promise<Otp[]>} List of all non-confirmed otp
   */

  @Get()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<Otp[]> {
    try {
      return await this.otpService.findAll();
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  /**
   * Get single not confirmed otp
   * @param id
   * @returns {Promise<Otp>} List of all non-confirmed otp
   */

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NullableType<Otp>> {
    try {
      return await this.otpService.findOne({ id });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  /**
   * Delete a reward by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    try {
      return await this.otpService.remove(id);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  /**
   * re-Send Otp to received phone
   * @returns {void}
   * @param resendVerifyOtpDto
   */

  @Put('verify/resend')
  @HttpCode(HttpStatus.CREATED)
  async resendOtp(
    @Body() resendVerifyOtpDto: ResendVerifyOtpDto,
  ): Promise<void> {
    try {
      await this.otpService.resendOtp(resendVerifyOtpDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
