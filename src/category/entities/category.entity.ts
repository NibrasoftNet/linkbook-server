import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from 'automapper-classes';

@Entity()
export class Category extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @OneToOne(() => FileEntity, (file) => file, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image?: FileEntity;

  @AutoMap(() => [Product])
  @OneToMany(() => Product, (product) => product.category, {
    eager: true,
    nullable: true,
  })
  products?: Product[];
}
