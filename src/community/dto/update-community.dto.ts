import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCommunityDto {
  @ApiProperty({ example: 'My com' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'My bio' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  constructor({
    name,
    bio,
    isPrivate,
  }: {
    name?: string | undefined;
    bio?: string | undefined;
    isPrivate?: boolean | undefined;
  }) {
    this.name = name;
    this.bio = bio;
    this.isPrivate = isPrivate;
  }
}
