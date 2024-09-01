import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ApplicantToSwap } from '../entities/applicant-to-swap.entity';
import { ApplicantToSwapDto } from '../dto/applicant-to-swap.dto';

export class ApplicantToSwapSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ApplicantToSwap, ApplicantToSwapDto);
    };
  }
}
