import { AutoMap } from 'automapper-classes';
import { CategoryDto } from '../../category/dto/category.dto';
import { FileDto } from '../../files/dto/file.dto';
import { ProductTypeEnum } from '../enum/product-type.enum';

export class ProductDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  stock: number;

  @AutoMap()
  price: number;

  @AutoMap(() => CategoryDto)
  category: CategoryDto;

  @AutoMap()
  description: string;

  @AutoMap(() => [FileDto])
  image: FileDto[];

  @AutoMap()
  type: ProductTypeEnum;

  @AutoMap()
  brand: string;

  @AutoMap()
  modal: string;

  @AutoMap()
  size: number;
}
