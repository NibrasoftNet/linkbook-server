import { AutoMap } from 'automapper-classes';
import { StoreDto } from '../../store/dto/store.dto';
import { UserDto } from '../../users/dto/user.dto';
import { StoreAdminType } from '../enum/Store-Admin-Type.enum';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class StoreAdminDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => StoreDto)
  store: StoreDto;

  @AutoMap(() => UserDto)
  tenant: UserDto;

  @AutoMap()
  adminType: StoreAdminType;
}
