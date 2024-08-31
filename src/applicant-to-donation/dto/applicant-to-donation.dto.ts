import { AutoMap } from 'automapper-classes';
import { DonationStatusEnum } from '../enums/donation-status.enum';
import { UserDto } from '../../users/dto/user.dto';
import { DonationDto } from '../../donation/dto/donation.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class ApplicantToDonationDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => DonationDto)
  donation: DonationDto;

  @AutoMap(() => UserDto)
  applicant: UserDto;

  @AutoMap()
  status: DonationStatusEnum;
}
