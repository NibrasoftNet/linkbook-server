import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { SwapDto } from '../../swap/dto/swap.dto';
import { SwapStatusEnum } from '../enums/swap-status.enum';
import { ProductDto } from '../../product/dto/product.dto';

export class ApplicantToSwapDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => SwapDto)
  swap: SwapDto;

  @AutoMap()
  quantity: string;

  @AutoMap(() => ProductDto)
  product: ProductDto;

  @AutoMap(() => UserDto)
  applicant: UserDto;

  @AutoMap()
  status: SwapStatusEnum;
}
