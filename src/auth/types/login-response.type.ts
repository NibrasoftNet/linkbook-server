import { UserDto } from '../../users/dto/user.dto';

export type LoginResponseType = Readonly<{
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: UserDto;
}>;
