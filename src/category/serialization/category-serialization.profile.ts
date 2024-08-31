import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from 'automapper-core';
import { Category } from '../entities/category.entity';
import { CategoryDto } from '../dto/category.dto';

export class CategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Category,
        CategoryDto,
        forMember(
          (dto: CategoryDto) => dto.image,
          mapFrom((source: Category) => source.image?.path || null),
        ),
      );
    };
  }
}
