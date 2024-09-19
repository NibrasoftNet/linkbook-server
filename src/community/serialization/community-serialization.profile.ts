import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Donation } from '../../donation/entities/donation.entity';
import { DonationDto } from '../../donation/dto/donation.dto';

export class CommunitySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Donation, DonationDto);
    };
  }
}
