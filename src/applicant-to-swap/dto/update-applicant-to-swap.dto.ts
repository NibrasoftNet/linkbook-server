import { PartialType } from '@nestjs/swagger';
import { CreateApplicantToSwapDto } from './create-applicant-to-swap.dto';

export class UpdateApplicantToSwapDto extends PartialType(
  CreateApplicantToSwapDto,
) {}
