import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AddressModule } from '../address/address.module';
import { Community } from './entities/community.entity';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { CommunitySerializationProfile } from './serialization/community-serialization.profile';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Community]),
    UsersModule,
    FilesModule,
    AddressModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService, CommunitySerializationProfile],
})
export class DonationModule {}
