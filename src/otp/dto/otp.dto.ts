import { ApiProperty } from '@nestjs/swagger';
export class OtpDto {
  @ApiProperty({ description: 'The email of the Otp.', required: true })
  email: string;
  @ApiProperty({ description: 'The recipient of the SMS.' })
  otp: string;
  @ApiProperty({ description: 'The recipient of the SMS.' })
  expireIn: number;
  constructor(email: string, otp: string, expireIn: number) {
    this.email = email;
    this.otp = otp;
    this.expireIn = expireIn;
  }
}
