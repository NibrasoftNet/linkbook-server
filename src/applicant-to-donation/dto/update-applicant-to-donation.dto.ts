import { PartialType } from '@nestjs/swagger';
import { CreateApplicantToDonationDto } from './create-applicant-to-donation.dto';

export class UpdateApplicantToDonationDto extends PartialType(
  CreateApplicantToDonationDto,
) {}
