import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateIf,
} from 'class-validator';
import { IsNotUsedByOthers } from '../../utils/validators/is-not-used-by-others';

export class UpdateStoreDto extends PartialType(
  OmitType(CreateStoreDto, ['storeUniqueCode'] as const),
) {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @ValidateIf((dto) => dto && dto.id)
  @Validate(IsNotUsedByOthers, ['Store', 'storeUniqueCode'])
  @IsString()
  storeUniqueCode?: string;
}
