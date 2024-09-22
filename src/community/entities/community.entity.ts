import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import { ApplicantToCommunity } from '../../applicant-to-community/entities/applicant-to-community.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { FileEntity } from '../../files/entities/file.entity';

@Entity()
export class Community extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  bio: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @AutoMap()
  @Column({ default: true })
  isPrivate: boolean;

  @AutoMap()
  @Column()
  invitationCode: string;

  @AutoMap(() => [ApplicantToCommunity])
  @OneToMany(
    () => ApplicantToCommunity,
    (applicantToCommunity) => applicantToCommunity.community,
    { nullable: true, onDelete: 'SET NULL' },
  )
  subscribers: ApplicantToCommunity[];

  @AutoMap()
  @OneToOne(() => FileEntity, (file) => file.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  image: FileEntity;

  @BeforeInsert()
  assignInvitationCode() {
    if (this.isPrivate) {
      this.invitationCode = randomStringGenerator();
    }
  }
}
