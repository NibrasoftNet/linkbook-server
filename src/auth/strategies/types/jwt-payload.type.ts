import { Session } from 'src/session/entities/session.entity';
import { User } from '../../../users/entities/user.entity';
import { NullableType } from '../../../utils/types/nullable.type';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  sessionId: Session['id'];
  storeId: NullableType<number>;
  iat: number;
  exp: number;
};
