import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { ProductDto } from '../../product/dto/product.dto';
import { AddressDto } from '../../address/dto/address.dto';
import { ApplicantToDonationDto } from '../../applicant-to-donation/dto/applicant-to-donation.dto';
import { Expose } from 'class-transformer';

export class DonationDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  creator: UserDto;

  @AutoMap()
  description?: string;

  @AutoMap()
  active: boolean;

  @AutoMap(() => ProductDto)
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  product: ProductDto;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => ProductDto)
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  quantity: number;

  @AutoMap(() => [ApplicantToDonationDto])
  @Expose({ groups: ['USER', 'ADMIN', 'STOREADMIN'] })
  applicants: ApplicantToDonationDto[];
}
