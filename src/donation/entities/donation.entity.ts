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
import { ApplicantToDonation } from '../../applicant-to-donation/entities/applicant-to-donation.entity';
import { AutoMap } from 'automapper-classes';
import { Address } from '../../address/entities/address.entity';

@Entity()
export class Donation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @Column({ nullable: false, default: 1 })
  quantity: number;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.donations, { onDelete: 'CASCADE' })
  creator: User;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  address: Address;

  @AutoMap(() => Product)
  @OneToOne(() => Product, (product) => product.id, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @AutoMap(() => [ApplicantToDonation])
  @OneToMany(
    () => ApplicantToDonation,
    (applicantToDonation) => applicantToDonation.donation,
    { nullable: true, onDelete: 'SET NULL' },
  )
  applicants: ApplicantToDonation[];
}
