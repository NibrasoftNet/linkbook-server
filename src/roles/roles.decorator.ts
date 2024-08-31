import { applyDecorators, SerializeOptions, SetMetadata } from '@nestjs/common';
import { RoleEnum } from './roles.enum';

export const Roles = (...roles: number[]) => {
  const rolesEnum: string[] = [];
  roles.forEach((role) => {
    rolesEnum.push(
      Object.keys(RoleEnum)[Object.values(RoleEnum).indexOf(role)],
    );
  });
  return applyDecorators(
    SetMetadata('roles', roles),
    SerializeOptions({ groups: rolesEnum }),
  );
};
