import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @AutoMap(() => FileEntity)
  @ApiProperty()
  @IsOptional()
  @IsObject()
  image?: FileEntity;
}
