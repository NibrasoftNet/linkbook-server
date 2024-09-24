import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommunityFeedDto {
  @AutoMap()
  @IsNotEmpty()
  @Type(() => Number)
  communityId: number;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  title: string;

  @AutoMap()
  @IsNotEmpty()
  @IsNotEmpty()
  description: string;

  @AutoMap()
  @IsNotEmpty()
  @IsNotEmpty()
  url: string;

  constructor({
    communityId,
    title,
    description,
    url,
  }: {
    communityId: number;
    title: string;
    description: string;
    url: string;
  }) {
    this.communityId = communityId;
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
