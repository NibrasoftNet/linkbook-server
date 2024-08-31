import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ApplicantToDonation } from '../entities/applicant-to-donation.entity';
import { ApplicantToDonationDto } from '../dto/applicant-to-donation.dto';

export class ApplicantToDonationSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ApplicantToDonation, ApplicantToDonationDto);
    };
  }
}
