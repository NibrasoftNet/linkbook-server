import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSearchHistoryDto {
  @AutoMap(() => User)
  user: User;

  @AutoMap()
  @IsString()
  @IsOptional()
  brand: string | null;

  @AutoMap()
  @IsString()
  @IsOptional()
  model: string | null;

  @AutoMap()
  @IsString()
  @IsOptional()
  color: string | null;

  @AutoMap()
  @IsString()
  @IsOptional()
  referenceNumber: string | null;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  constructor({
    brand,
    model,
    color,
    referenceNumber,
    imageUrl,
  }: {
    brand: string | null;
    model: string | null;
    color: string | null;
    referenceNumber: string | null;
    imageUrl: string;
  }) {
    this.brand = brand || null;
    this.model = model || null;
    this.color = color || null;
    this.referenceNumber = referenceNumber || null;
    this.imageUrl = imageUrl;
  }
}
