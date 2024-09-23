import { AutoMap } from 'automapper-classes';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommunityFeedDto {
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
    title,
    description,
    url,
  }: {
    title?: string | undefined;
    description?: string;
    url?: string;
  }) {
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
