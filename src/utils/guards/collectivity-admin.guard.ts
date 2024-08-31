import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RoleEnum } from '../../roles/roles.enum';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

@Injectable()
export class CollectivityAdminGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const id = +request.params.id; // Access the 'collectivity id' parameter from the request
    const userJwtPayload: JwtPayloadType = request.user;

    if (!userJwtPayload || !id) {
      throw new UnauthorizedException('{"auth":"Unauthorized"}');
    }

    if (
      userJwtPayload.role.id === RoleEnum.STOREADMIN &&
      !userJwtPayload.storeId
    ) {
      throw new UnauthorizedException('{"auth":"Unauthorized"}');
    }

    if (userJwtPayload.role.id === RoleEnum.ADMIN) {
      if (id !== userJwtPayload.storeId) {
        throw new UnauthorizedException('{"auth":"Unauthorized"}');
      }
    }
    return true;
  }
}
