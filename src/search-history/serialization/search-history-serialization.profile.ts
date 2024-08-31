import { Injectable } from '@nestjs/common';

import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SearchHistory } from '../entities/search-history.entity';
import { SearchHistoryDto } from '../dto/search-history.dto';

@Injectable()
export class SearchHistorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SearchHistory, SearchHistoryDto);
    };
  }
}
