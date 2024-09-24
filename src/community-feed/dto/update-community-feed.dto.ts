import { AutoMap } from 'automapper-classes';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCommunityFeedDto {
  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  communityId?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  title?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  description?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  url?: string;

  constructor({
    communityId,
    title,
    description,
    url,
  }: {
    communityId?: number;
    title?: string | undefined;
    description?: string;
    url?: string;
  }) {
    this.communityId = communityId;
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
