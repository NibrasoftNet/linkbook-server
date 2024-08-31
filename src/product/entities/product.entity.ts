import { Category } from '../../category/entities/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { ProductTypeEnum } from '../enum/product-type.enum';

@Entity()
export class Product extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ nullable: false, default: 0 })
  stock: number;

  @AutoMap()
  @Column({ nullable: false, default: 0 })
  price: number;

  @AutoMap()
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;

  @AutoMap()
  @Column({ nullable: true })
  description: string;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, (file) => file, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  image: FileEntity[] | null;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    default: ProductTypeEnum.PURCHASES,
  })
  type: ProductTypeEnum;

  @AutoMap()
  @Column({ nullable: true })
  brand: string;

  @AutoMap()
  @Column({ nullable: true })
  modal: string;

  @AutoMap()
  @Column({ nullable: false, default: 0 })
  size: number;
}
