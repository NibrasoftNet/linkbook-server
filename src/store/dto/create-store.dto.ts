import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileEntity } from '../../files/entities/file.entity';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileDto } from '../../files/dto/file.dto';

export class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  @ValidateNested()
  image?: FileEntity | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @Validate(IsNotExist, ['Store', 'validation.storeCodeAlreadyExists'])
  @IsNotEmpty()
  storeUniqueCode: string;

  constructor(createStoreDto: Partial<CreateStoreDto>) {
    Object.assign(this, createStoreDto);
  }
}
