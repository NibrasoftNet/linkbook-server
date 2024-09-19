import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { CommunitySubscriptionStatusEnum } from '../enums/community-subscription-status.enum';
import { AutoMap } from 'automapper-classes';
import { Community } from '../../community/entities/community.entity';

@Entity()
export class ApplicantToCommunity extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Community)
  @ManyToOne(() => Community, (community) => community.subscribers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: Community;

  @AutoMap(() => User)
  @ManyToOne(() => User, (subscriber) => subscriber.requestedCommunities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscriber_id' })
  subscriber: User;

  @AutoMap()
  @Column({ default: CommunitySubscriptionStatusEnum.PENDING })
  status: CommunitySubscriptionStatusEnum;
}
