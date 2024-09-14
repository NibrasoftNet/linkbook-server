import { AutoMap } from 'automapper-classes';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Validate } from 'class-validator';

export class RoleDto {
  @AutoMap()
  @Validate(IsExist, ['Role', 'id', 'validation.roleNotExists'])
  id: number;

  @AutoMap()
  name: string;
}
