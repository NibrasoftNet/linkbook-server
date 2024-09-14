import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class AuthUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  // @ValidateNested()
  address?: CreateAddressDto | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  password?: string;

  constructor({
    firstName,
    lastName,
    address,
    phone,
    email,
    password,
  }: {
    firstName?: string;
    lastName?: string;
    address?: CreateAddressDto;
    phone?: string;
    email?: string;
    password?: string;
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.password = password;
  }
}
