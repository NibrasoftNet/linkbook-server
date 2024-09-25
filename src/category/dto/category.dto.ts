import { AutoMap } from 'automapper-classes';
import { ProductDto } from '../../product/dto/product.dto';
import { Exclude, Expose } from 'class-transformer';
import { FileDto } from '../../files/dto/file.dto';

@Exclude()
export class CategoryDto {
  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  id: number;

  @AutoMap()
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  name: string;

  @AutoMap(() => FileDto)
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  image: FileDto;

  @Expose({ groups: ['ADMIN'] })
  @AutoMap(() => [ProductDto])
  products: ProductDto[];
}
