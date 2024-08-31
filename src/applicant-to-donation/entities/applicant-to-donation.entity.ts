import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { DonationStatusEnum } from '../enums/donation-status.enum';
import { Donation } from '../../donation/entities/donation.entity';
import { AutoMap } from 'automapper-classes';

@Entity()
export class ApplicantToDonation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Donation)
  @ManyToOne(() => Donation, (donation) => donation.applicants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'donation_id' })
  donation: Donation;

  @AutoMap(() => User)
  @ManyToOne(() => User, (applicant) => applicant.requestedDonations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @AutoMap()
  @Column({ default: DonationStatusEnum.PENDING })
  status: DonationStatusEnum;
}
