import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { Swap } from '../../swap/entities/swap.entity';
import { SwapStatusEnum } from '../enums/swap-status.enum';
import { AutoMap } from 'automapper-classes';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class ApplicantToSwap extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Swap)
  @ManyToOne(() => Swap, (swap) => swap.applicants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'swap_id' })
  swap: Swap;

  @AutoMap()
  @Column({ nullable: false, default: 1 })
  quantity: number;

  @AutoMap(() => Product)
  @OneToOne(() => Product, (product) => product.id, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @AutoMap(() => User)
  @ManyToOne(() => User, (applicant) => applicant.requestedSwaps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @AutoMap()
  @Column({ default: SwapStatusEnum.PENDING })
  status: SwapStatusEnum;
}
