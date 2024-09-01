import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class CreateApplicantToSwapDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateProductDto)
  @ValidateNested()
  product: CreateProductDto;

  constructor({
    quantity,
    product,
  }: {
    description: string;
    quantity: number;
    product: CreateProductDto;
    address: CreateAddressDto;
  }) {
    this.quantity = quantity;
    this.product = product;
  }
}
