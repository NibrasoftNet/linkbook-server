import { Module, Global } from '@nestjs/common';
import { AwsS3Provider } from './aws-s3.provider';
import { AwsS3Service } from './aws-s3.service';

@Global()
@Module({
  providers: [AwsS3Provider, AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
