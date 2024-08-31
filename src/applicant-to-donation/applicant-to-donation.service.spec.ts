import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantToDonationService } from './applicant-to-donation.service';

describe('ApplicantToDonationService', () => {
  let service: ApplicantToDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantToDonationService],
    }).compile();

    service = module.get<ApplicantToDonationService>(
      ApplicantToDonationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
