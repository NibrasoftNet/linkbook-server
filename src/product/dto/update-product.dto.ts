import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  affiliationCount?: number;
}
