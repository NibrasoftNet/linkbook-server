import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class AddressDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: number;

  @AutoMap()
  @Expose()
  country: string;

  @AutoMap()
  @Expose()
  city: string;

  @AutoMap()
  @Expose()
  longitude: number;

  @AutoMap()
  @Expose()
  latitude: number;

  @AutoMap(() => String)
  @Expose()
  countryFlag?: string | null;

  @AutoMap()
  street: string;

  @AutoMap()
  @Expose()
  fullAddress: string;
}
