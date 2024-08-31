import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchByUrlDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
