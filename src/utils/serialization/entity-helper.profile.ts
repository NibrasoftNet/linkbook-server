import { Injectable } from '@nestjs/common';
import EntityHelper from '../entities/entity-helper';
import { EntityHelperDto } from '../dtos/entity-helper.dto';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';

@Injectable()
export class EntityHelperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, EntityHelper, EntityHelperDto);
    };
  }
}
