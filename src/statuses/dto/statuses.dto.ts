import { AutoMap } from 'automapper-classes';
import { Validate } from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';

export class StatusesDto {
  @AutoMap()
  @Validate(IsExist, ['Status', 'id', 'validation.statusNotExists'])
  id: number;

  @AutoMap()
  name: string;
}
