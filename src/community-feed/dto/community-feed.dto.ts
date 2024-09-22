import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { FileDto } from '../../files/dto/file.dto';

export class CommunityFeedDto {
  @AutoMap()
  id: number;

  @AutoMap()
  title: string;

  @AutoMap()
  description: string;

  @AutoMap()
  url: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => [FileDto])
  image: FileDto;
}
