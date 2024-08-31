import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Swap } from '../entities/swap.entity';
import { SwapDto } from '../dto/swap.dto';

export class SwapSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Swap, SwapDto);
    };
  }
}
