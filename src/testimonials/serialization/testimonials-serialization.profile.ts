import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TestimonialDto } from '../dto/testimonial.dto';
import { Testimonial } from '../entities/testimonial.entity';

export class TestimonialsSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Testimonial, TestimonialDto);
    };
  }
}
