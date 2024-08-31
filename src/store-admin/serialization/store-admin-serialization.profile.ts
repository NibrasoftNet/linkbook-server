import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { StoreAdmin } from '../entities/store-admin.entity';
import { StoreAdminDto } from '../store-admin.dto';

@Injectable()
export class StoreAdminSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, StoreAdmin, StoreAdminDto);
    };
  }
}
