import { Module } from '@nestjs/common';
import { ApplicantToSwapService } from './applicant-to-swap.service';
import { ApplicantToSwapController } from './applicant-to-swap.controller';

@Module({
  controllers: [ApplicantToSwapController],
  providers: [ApplicantToSwapService],
})
export class ApplicantToSwapModule {}
