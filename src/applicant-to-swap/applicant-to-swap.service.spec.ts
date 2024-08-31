import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantToSwapService } from './applicant-to-swap.service';

describe('ApplicantToSwapService', () => {
  let service: ApplicantToSwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantToSwapService],
    }).compile();

    service = module.get<ApplicantToSwapService>(ApplicantToSwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
