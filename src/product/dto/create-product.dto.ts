import { AutoMap } from 'automapper-classes';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductTypeEnum } from '../enum/product-type.enum';

export class CreateProductDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsNumber()
  stock: number;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @Validate(IsExist, ['Category', 'id', 'validation.categoryNotExists'])
  categoryId: number;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  type: ProductTypeEnum;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsString()
  modal: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsNumber()
  size: number;

  constructor({
    name,
    stock,
    price,
    categoryId,
    description,
    type,
    brand,
    modal,
    size,
  }: {
    name: string;
    categoryId: number;
    description: string;
    type: ProductTypeEnum;
    brand?: string;
    modal?: string;
    size?: number;
    stock?: number;
    price?: number;
  }) {
    this.name = name;
    this.categoryId = categoryId;
    this.description = description;
    this.type = type;
    this.brand = brand ? brand : '';
    this.modal = modal ? modal : '';
    this.size = size ? size : 0;
    this.stock = stock ? stock : 0;
    this.price = price ? price : 0;
  }
}
