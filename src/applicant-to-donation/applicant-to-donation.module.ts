import { Module } from '@nestjs/common';
import { ApplicantToDonationService } from './applicant-to-donation.service';
import { ApplicantToDonationController } from './applicant-to-donation.controller';
import { ApplicantToDonationSerializationProfile } from './serialization/applicant-to-donation-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantToDonation } from './entities/applicant-to-donation.entity';
import { Donation } from '../donation/entities/donation.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicantToDonation, Donation]),
    UsersModule,
  ],
  controllers: [ApplicantToDonationController],
  providers: [
    ApplicantToDonationService,
    ApplicantToDonationSerializationProfile,
  ],
})
export class ApplicantToDonationModule {}
