import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ApplicantToCommunityDto } from '../dto/applicant-to-community.dto';
import { ApplicantToCommunity } from '../entities/applicant-to-community.entity';

export class ApplicantToCommunitySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ApplicantToCommunity, ApplicantToCommunityDto);
    };
  }
}
