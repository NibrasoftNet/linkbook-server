import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../files/entities/file.entity';
import bcrypt from 'bcryptjs';
import EntityHelper from '../../utils/entities/entity-helper';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { Address } from '../../address/entities/address.entity';
import { AutoMap } from 'automapper-classes';
import { StoreAdmin } from '../../store-admin/entities/store-admin.entity';
import { Donation } from '../../donation/entities/donation.entity';
import { ApplicantToDonation } from '../../applicant-to-donation/entities/applicant-to-donation.entity';
import { Swap } from '../../swap/entities/swap.entity';
import { ApplicantToSwap } from '../../applicant-to-swap/entities/applicant-to-swap.entity';
import { ApplicantToCommunity } from '../../applicant-to-community/entities/applicant-to-community.entity';

@Entity()
export class User extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @AutoMap()
  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ nullable: true, type: String })
  password: string;

  public previousPassword: string;

  @AutoMap()
  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @AutoMap(() => String)
  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  firstName?: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @AutoMap(() => String)
  @Index()
  @Column({ type: String, nullable: true, unique: true })
  phone: string | null;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @AutoMap(() => Role)
  @ManyToOne(() => Role, {
    eager: true,
  })
  role: Role;

  @AutoMap(() => Status)
  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @DeleteDateColumn()
  deletedAt: Date;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  notificationsToken?: string | null;

  @AutoMap(() => StoreAdmin)
  @OneToMany(() => StoreAdmin, (storeAdmin) => storeAdmin.tenant, {
    eager: true,
    nullable: true,
  })
  stores: StoreAdmin[];

  @AutoMap(() => [Donation])
  @OneToMany(() => Donation, (donation) => donation.creator, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  donations?: Donation[];

  @AutoMap(() => [ApplicantToDonation])
  @OneToMany(
    () => ApplicantToDonation,
    (applicantToDonation) => applicantToDonation.donation,
    {
      nullable: true,
    },
  )
  requestedDonations: ApplicantToDonation[];

  @AutoMap(() => [Swap])
  @OneToMany(() => Swap, (swap) => swap.creator, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  swaps?: Swap[];

  @AutoMap(() => [ApplicantToSwap])
  @OneToMany(() => ApplicantToSwap, (applicantToSwap) => applicantToSwap.swap, {
    nullable: true,
  })
  requestedSwaps: ApplicantToSwap[];

  @AutoMap(() => [ApplicantToCommunity])
  @OneToMany(
    () => ApplicantToCommunity,
    (applicantToCommunity) => applicantToCommunity.community,
    {
      nullable: true,
    },
  )
  requestedCommunities: ApplicantToCommunity[];

  @AutoMap(() => Boolean)
  @Column({ type: Boolean, default: true })
  isNewUser: boolean;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
