import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantToSwapController } from './applicant-to-swap.controller';
import { ApplicantToSwapService } from './applicant-to-swap.service';

describe('ApplicantToSwapController', () => {
  let controller: ApplicantToSwapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantToSwapController],
      providers: [ApplicantToSwapService],
    }).compile();

    controller = module.get<ApplicantToSwapController>(
      ApplicantToSwapController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
