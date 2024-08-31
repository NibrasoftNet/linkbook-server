import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { AddressDto } from '../../address/dto/address.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { FileEntity } from '../../files/entities/file.entity';
import { StoreAdmin } from '../../store-admin/entities/store-admin.entity';

export class StoreDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  @Expose()
  name: string;

  @AutoMap()
  @Expose()
  bio: string;

  @AutoMap(() => FileEntity)
  image?: string;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap()
  storeUniqueCode: string;

  @AutoMap(() => [StoreAdmin])
  tenants?: StoreAdmin[] | null;
}
