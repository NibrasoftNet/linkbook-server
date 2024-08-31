import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { RoleEnum } from '../../roles/roles.enum';
import { I18nContext, I18nService } from 'nestjs-i18n';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  validate(payload: JwtPayloadType): JwtPayloadType {
    if (
      !payload.id ||
      (payload.role.id === RoleEnum.STOREADMIN && !payload.storeId)
    ) {
      throw new UnauthorizedException(
        `{"auth":${this.i18n.t('auth.userNotAuthorized', { lang: I18nContext.current()?.lang })}}`,
      );
    }
    return payload;
  }
}
