import { AutoMap } from 'automapper-classes';
import { StoreDto } from '../store/dto/store.dto';
import { UserDto } from '../users/dto/user.dto';
import { StoreAdminType } from './enum/Store-Admin-Type.enum';

export class StoreAdminDto {
  @AutoMap()
  id: number;

  @AutoMap(() => StoreDto)
  store: StoreDto;

  @AutoMap(() => UserDto)
  tenant: UserDto;

  @AutoMap()
  adminType: StoreAdminType;
}
