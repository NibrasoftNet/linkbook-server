import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class AuthUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

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
