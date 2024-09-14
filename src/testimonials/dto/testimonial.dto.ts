import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';

export class TestimonialDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  comment: string;

  @AutoMap()
  rate: number;

  @AutoMap(() => UserDto)
  user: UserDto;
}
