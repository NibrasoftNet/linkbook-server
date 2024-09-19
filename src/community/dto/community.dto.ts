import { EntityHelperDto } from '../../utils/dtos/entity-helper.dto';
import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';
import { ApplicantToCommunityDto } from '../../applicant-to-community/dto/applicant-to-community.dto';
import { FileDto } from '../../files/dto/file.dto';

export class CommunityDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  bio: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap()
  isPrivate: boolean;

  @AutoMap()
  invitationCode: string;

  @AutoMap(() => [ApplicantToCommunityDto])
  applicants: ApplicantToCommunityDto[];

  @AutoMap(() => FileDto)
  image: FileDto;
}
