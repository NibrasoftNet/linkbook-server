import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityDto {
  @ApiProperty({ example: 'My community' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'bio' })
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  constructor({
    name,
    bio,
    description,
    isPrivate,
  }: {
    name: string;
    bio: string;
    description?: string;
    isPrivate?: boolean | false;
  }) {
    this.name = name;
    this.bio = bio;
    this.description = description;
    this.isPrivate = isPrivate;
  }
}
