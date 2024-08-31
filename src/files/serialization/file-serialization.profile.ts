import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { FileDto } from '../dto/file.dto';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        FileEntity,
        FileDto,
        /*        forMember(
          (dto: StoreDto) => dto.image,
          mapFrom((source: Store) => source.image?.path || null),
        ),*/
      );
    };
  }
}
