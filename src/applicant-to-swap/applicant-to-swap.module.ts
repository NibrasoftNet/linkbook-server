import { Module } from '@nestjs/common';
import { ApplicantToSwapService } from './applicant-to-swap.service';
import { ApplicantToSwapController } from './applicant-to-swap.controller';
import { ApplicantToSwapSerializationProfile } from './serialization/applicant-to-swap-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ApplicantToSwap } from './entities/applicant-to-swap.entity';
import { Swap } from '../swap/entities/swap.entity';
import { ProductModule } from '../product/product.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicantToSwap, Swap]),
    UsersModule,
    ProductModule,
    NotificationModule,
  ],
  controllers: [ApplicantToSwapController],
  providers: [ApplicantToSwapService, ApplicantToSwapSerializationProfile],
})
export class ApplicantToSwapModule {}
