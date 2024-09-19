import { PartialType } from '@nestjs/swagger';
import { CreateApplicantToCommunityDto } from './create-applicant-to-community.dto';

export class UpdateApplicantToCommunityDto extends PartialType(
  CreateApplicantToCommunityDto,
) {}
