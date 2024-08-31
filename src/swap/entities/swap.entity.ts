import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { ApplicantToSwap } from '../../applicant-to-swap/entities/applicant-to-swap.entity';
import { Address } from '../../address/entities/address.entity';
import { AutoMap } from 'automapper-classes';

@Entity()
export class Swap extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @AutoMap()
  @Column({ nullable: false, default: 1 })
  quantity: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.swaps, { onDelete: 'CASCADE' })
  creator: User;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap()
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  address: Address;

  @AutoMap()
  @OneToOne(() => Product, (product) => product.id, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  product: Product;

  @AutoMap()
  @OneToMany(
    () => ApplicantToSwap,
    (applicantToSwap) => applicantToSwap.applicant,
    { nullable: true, onDelete: 'SET NULL' },
  )
  applicants: ApplicantToSwap[];
}
