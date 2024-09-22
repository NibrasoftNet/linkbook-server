import { PartialType } from '@nestjs/swagger';
import { CreateCommunityFeedDto } from './create-community-feed.dto';

export class UpdateCommunityFeedDto extends PartialType(
  CreateCommunityFeedDto,
) {}
