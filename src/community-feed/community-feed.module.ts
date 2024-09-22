import { Module } from '@nestjs/common';
import { CommunityFeedService } from './community-feed.service';
import { CommunityFeedController } from './community-feed.controller';
import { CommunityFeedSerializationProfile } from './serialization/community-feed-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityFeed } from './entities/community-feed.entity';
import { CommunityModule } from '../community/community.module';
import { UsersModule } from '../users/users.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityFeed]),
    UsersModule,
    CommunityModule,
    FilesModule,
  ],
  controllers: [CommunityFeedController],
  providers: [CommunityFeedService, CommunityFeedSerializationProfile],
})
export class CommunityFeedModule {}
