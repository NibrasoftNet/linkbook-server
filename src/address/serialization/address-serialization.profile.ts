import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Injectable } from '@nestjs/common';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from 'automapper-core';
import { Address } from '../entities/address.entity';
import { AddressDto } from '../dto/address.dto';

@Injectable()
export class AddressSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Address,
        AddressDto,
        forMember(
          (dto: AddressDto) => dto.fullAddress,
          mapFrom(
            (source: Address) =>
              source.street + ', ' + source.city + ', ' + source.country,
          ),
        ),
      );
    };
  }
}
