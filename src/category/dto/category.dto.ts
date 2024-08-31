import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { ProductDto } from '../../product/dto/product.dto';

export class CategoryDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap(() => FileEntity)
  image: string;

  @AutoMap(() => ProductDto)
  products: ProductDto;
}
