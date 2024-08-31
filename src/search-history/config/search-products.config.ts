import { registerAs } from '@nestjs/config';

export default registerAs('oxylabs', () => ({
  url: process.env.OXYLABS_URL,
  username: process.env.OXYLABS_USERNAME,
  password: process.env.OXYLABS_PASSWORD,
}));
