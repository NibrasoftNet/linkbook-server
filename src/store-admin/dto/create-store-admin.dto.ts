import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { StoreAdminType } from '../enum/Store-Admin-Type.enum';

export class CreateStoreAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  storeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tenantId: number;

  @ApiProperty({ example: StoreAdminType.EDITOR })
  @IsOptional()
  @IsEnum(StoreAdminType)
  adminType: StoreAdminType;
}
