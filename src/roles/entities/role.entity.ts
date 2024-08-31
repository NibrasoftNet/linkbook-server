import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber } from 'class-validator';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';

@Entity()
export class Role extends EntityHelper {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  @IsNumber()
  id: number;

  @AutoMap()
  @Allow()
  @ApiProperty({ example: 'admin' })
  @Column()
  name: string;
}
