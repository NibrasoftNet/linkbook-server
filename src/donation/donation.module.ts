import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';
import { Donation } from './entities/donation.entity';
import { DonationSerializationProfile } from './serialization/donation-serialization.profile';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation]),
    UsersModule,
    ProductModule,
    AddressModule,
  ],
  controllers: [DonationController],
  providers: [DonationService, DonationSerializationProfile],
})
export class DonationModule {}
