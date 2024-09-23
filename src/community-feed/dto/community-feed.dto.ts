import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { FileDto } from '../../files/dto/file.dto';
import { CommunityDto } from '../../community/dto/community.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class CommunityFeedDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  title: string;

  @AutoMap()
  description: string;

  @AutoMap()
  url: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => CommunityDto)
  community: CommunityDto;

  @AutoMap(() => [FileDto])
  image: FileDto[];
}
