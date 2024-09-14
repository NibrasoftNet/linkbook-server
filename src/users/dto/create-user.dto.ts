import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusesDto } from '../../statuses/dto/statuses.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User', 'email', 'validation.emailAlreadyExists'])
  @IsEmail()
  email: string;

  @ApiProperty({ type: RoleDto })
  @IsNotEmpty()
  @Type(() => RoleDto)
  @ValidateNested()
  role: RoleDto;

  @ApiProperty({ type: StatusesDto })
  @IsNotEmpty()
  @Type(() => StatusesDto)
  @ValidateNested()
  status: StatusesDto;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  @ValidateNested()
  photo?: FileDto | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password?: string;

  provider?: string;

  socialId?: string;

  hash?: string | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;

  @ApiProperty()
  @IsOptional()
  referralCode?: string;

  constructor({
    email,
    role,
    status,
    photo,
    firstName,
    lastName,
    password,
    provider,
    socialId,
  }: {
    email: string;
    role: RoleDto;
    status: StatusesDto;
    photo?: FileDto | null;
    firstName?: string;
    lastName?: string;
    password?: string;
    provider?: string;
    socialId?: string;
  }) {
    this.email = email;
    this.role = role;
    this.status = status;
    this.photo = photo;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.provider = provider;
    this.socialId = socialId;
  }
}
