import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Store } from '../entities/store.entity';
import { StoreDto } from '../dto/store.dto';

@Injectable()
export class StoreSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Store,
        StoreDto,
        forMember(
          (dto: StoreDto) => dto.image,
          mapFrom((source: Store) => source.image?.path || null),
        ),
      );
    };
  }
}
