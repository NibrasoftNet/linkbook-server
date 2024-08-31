import { AutoMap } from 'automapper-classes';

export class FileDto {
  @AutoMap()
  id: string;

  @AutoMap()
  path: string;
}
