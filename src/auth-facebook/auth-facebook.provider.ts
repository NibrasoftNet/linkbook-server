import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';

export const OAuth2FacebookProvider: Provider = {
  provide: 'OAuth2FacebookClient',
  useFactory: (configService: ConfigService) => {
    const appId = configService.getOrThrow<string>('facebook.appId', {
      infer: true,
    });
    const appSecret = configService.getOrThrow<string>('facebook.appSecret', {
      infer: true,
    });

    const fbOptions = {
      appId,
      appSecret,
      xfbml: true,
      version: 'v19.0',
    };

    return new Facebook(fbOptions);
  },
  inject: [ConfigService],
};
