import { Expose } from 'class-transformer';
import { FileEntity } from '../../files/entities/file.entity';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { AutoMap } from 'automapper-classes';
import { AddressDto } from '../../address/dto/address.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { StoreAdminDto } from '../../store-admin/store-admin.dto';

export class UserDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  firstName?: string;

  @AutoMap()
  @Expose()
  lastName?: string;

  @AutoMap()
  phone: string;

  @AutoMap(() => FileEntity)
  @Expose()
  photo?: string;

  @AutoMap(() => Role)
  role: string;

  @AutoMap(() => Status)
  status: string;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => StoreAdminDto)
  stores: StoreAdminDto[];

  @AutoMap(() => Date)
  @Expose({ groups: ['admin'] })
  deletedAt: string;

  fullName: string;

  @AutoMap(() => Boolean)
  isNewUser: string;
}
