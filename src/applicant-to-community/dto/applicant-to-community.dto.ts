import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { CommunityDto } from '../../community/dto/community.dto';
import { CommunitySubscriptionStatusEnum } from '../enums/community-subscription-status.enum';

export class ApplicantToCommunityDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => CommunityDto)
  community: CommunityDto;

  @AutoMap(() => UserDto)
  subscriber: UserDto;

  @AutoMap()
  status: CommunitySubscriptionStatusEnum;
}
