import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantToDonationController } from './applicant-to-donation.controller';
import { ApplicantToDonationService } from './applicant-to-donation.service';

describe('ApplicantToDonationController', () => {
  let controller: ApplicantToDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantToDonationController],
      providers: [ApplicantToDonationService],
    }).compile();

    controller = module.get<ApplicantToDonationController>(
      ApplicantToDonationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
