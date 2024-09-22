import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommunityFeedDto {
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
    title,
    description,
    url,
  }: {
    title: string;
    description: string;
    url: string;
  }) {
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
