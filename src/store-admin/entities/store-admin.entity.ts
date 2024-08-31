import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { Store } from '../../store/entities/store.entity';
import { StoreAdminType } from '../enum/Store-Admin-Type.enum';
import { AutoMap } from 'automapper-classes';

@Entity()
export class StoreAdmin extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Store)
  @ManyToOne(() => Store, (store) => store.tenants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @AutoMap(() => User)
  @ManyToOne(() => User, (tenant) => tenant.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: User;

  @AutoMap()
  @Column({ default: StoreAdminType.ADMIN })
  adminType: StoreAdminType;
}
