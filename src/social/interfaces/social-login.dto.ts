import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class SocialLoginDto {
  @ApiProperty({ description: 'The unique identifier for the social entry' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;

  constructor({ id, email }: { id: string; email: string }) {
    this.id = id;
    this.email = email;
  }
}
