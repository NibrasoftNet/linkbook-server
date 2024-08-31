import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { UpdateProductDto } from '../../product/dto/update-product.dto';

export class UpdateDonationDto {
  @ApiProperty({ example: 'My donation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => UpdateProductDto)
  @ValidateNested()
  product?: UpdateProductDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  constructor({
    description,
    quantity,
    product,
    address,
  }: {
    description?: string | undefined;
    quantity?: number | undefined;
    product?: UpdateProductDto | undefined;
    address?: CreateAddressDto | undefined;
  }) {
    this.description = description;
    this.quantity = quantity;
    this.product = product;
    this.address = address;
  }
}
