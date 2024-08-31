import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  ValidateNested,
  ValidateIf,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class SocialLoginRegisterDto {
  @ApiProperty({ description: 'The unique identifier for the social entry' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The first name of the user', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'The last name of the user', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({ description: 'The phone number of the user', required: false })
  @IsOptional()
  @ValidateIf((dto) => dto.isNewUser === true)
  @Validate(IsNotExist, ['User'], {
    message: 'phoneAlreadyExists',
  })
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'The address of the user',
    type: () => CreateAddressDto,
  })
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address: CreateAddressDto;

  @ApiProperty({ description: 'The picture URL of the user', required: false })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiProperty({ description: 'Indicates if the user is new' })
  @IsOptional()
  @IsBoolean()
  isNewUser?: boolean;
}
