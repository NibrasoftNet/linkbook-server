import EntityHelper from '../../utils/entities/entity-helper';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileEntity } from '../../files/entities/file.entity';
import { Address } from '../../address/entities/address.entity';
import { AutoMap } from 'automapper-classes';
import { StoreAdmin } from '../../store-admin/entities/store-admin.entity';

@Entity()
export class Store extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  bio: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @OneToOne(() => FileEntity, (file) => file, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image?: FileEntity;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @AutoMap()
  @Column({ nullable: false, unique: true })
  storeUniqueCode: string;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => [StoreAdmin])
  @OneToMany(() => StoreAdmin, (storeAdmin) => storeAdmin.store, {
    nullable: true,
    eager: true,
  })
  tenants?: StoreAdmin[];
}
