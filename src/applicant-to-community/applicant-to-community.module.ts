import { Module } from '@nestjs/common';
import { ApplicantToCommunitySerializationProfile } from './serialization/applicant-to-community-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { ApplicantToCommunity } from './entities/applicant-to-community.entity';
import { Community } from '../community/entities/community.entity';
import { ApplicantToCommunityController } from './applicant-to-community.controller';
import { ApplicantToCommunityService } from './applicant-to-community.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicantToCommunity, Community]),
    UsersModule,
    NotificationModule,
  ],
  controllers: [ApplicantToCommunityController],
  providers: [
    ApplicantToCommunityService,
    ApplicantToCommunitySerializationProfile,
  ],
})
export class ApplicantToCommunityModule {}
