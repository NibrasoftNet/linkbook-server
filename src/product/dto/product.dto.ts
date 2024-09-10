import { AutoMap } from 'automapper-classes';
import { CategoryDto } from '../../category/dto/category.dto';
import { FileDto } from '../../files/dto/file.dto';
import { ProductTypeEnum } from '../enum/product-type.enum';
import { Expose } from 'class-transformer';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class ProductDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  stock: number;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  price: number;

  @AutoMap(() => CategoryDto)
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  category: CategoryDto;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  description: string;

  @AutoMap(() => [FileDto])
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  image: FileDto[];

  @AutoMap()
  type: ProductTypeEnum;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  brand: string;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  modal: string;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  size: number;
}
