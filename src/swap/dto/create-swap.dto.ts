import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class CreateSwapDto {
  @ApiProperty({ example: 'My donation' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateProductDto)
  @ValidateNested()
  product: CreateProductDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address: CreateAddressDto;

  constructor({
    description,
    quantity,
    product,
    address,
  }: {
    description: string;
    quantity: number;
    product: CreateProductDto;
    address: CreateAddressDto;
  }) {
    this.description = description;
    this.quantity = quantity;
    this.product = product;
    this.address = address;
  }
}
