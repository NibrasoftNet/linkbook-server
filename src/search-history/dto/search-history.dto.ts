import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class SearchHistoryDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  user: UserDto;

  @AutoMap(() => String)
  brand: string | null;

  @AutoMap(() => String)
  model: string;

  @AutoMap(() => String)
  color: string;

  @AutoMap(() => String)
  referenceNumber: string;

  @AutoMap(() => String)
  imageUrl: string;
}
