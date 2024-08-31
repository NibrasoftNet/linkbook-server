import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

export const OAuth2GoogleProvider: Provider = {
  provide: 'OAuth2GoogleClient',
  useFactory: (configService: ConfigService) => {
    const clientId = configService.getOrThrow<string>('google.clientId', {
      infer: true,
    });
    const clientSecret = configService.getOrThrow<string>(
      'google.clientSecret',
      {
        infer: true,
      },
    );

    return new OAuth2Client(clientId, clientSecret);
  },
  inject: [ConfigService],
};
