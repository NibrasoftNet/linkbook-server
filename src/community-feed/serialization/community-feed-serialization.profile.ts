import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { CommunityFeed } from '../entities/community-feed.entity';
import { CommunityFeedDto } from '../dto/community-feed.dto';

export class CommunityFeedSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CommunityFeed, CommunityFeedDto);
    };
  }
}
