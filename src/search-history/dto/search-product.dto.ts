import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchProductDto {
  @ApiProperty({
    example: 'amazon_search',
    description: 'Source of the search',
  })
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ example: 'fr', description: 'Domain of the search' })
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({ example: 'nike air max', description: 'Query of the search' })
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ example: 1, description: 'Start page of the search' })
  @AutoMap()
  @IsNumber()
  start_page: number;

  @ApiProperty({ example: 1, description: 'Number of pages of the search' })
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  pages: number;

  @ApiProperty({ example: true, description: 'Parse the search' })
  @AutoMap()
  @IsBoolean()
  @IsNotEmpty()
  parse: boolean;

  constructor(
    source: string,
    domain: string,
    query: string,
    start_page: number,
    pages: number,
    parse: boolean | true,
  ) {
    this.source = source;
    this.domain = domain;
    this.query = query;
    this.start_page = start_page;
    this.pages = pages;
    this.parse = parse;
  }
}
