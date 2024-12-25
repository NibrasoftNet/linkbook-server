import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from '../../../community/entities/community.entity';
import { CommunitySeedService } from './community-seed.service';
import { CommunityFactory } from './community.factory';
import { User } from 'src/users/entities/user.entity';
import { UserSeedModule } from '../user/user-seed.module';
import { FileEntity } from 'src/files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Community, User, FileEntity]),
    UserSeedModule,
  ],
  providers: [CommunitySeedService, CommunityFactory],
  exports: [CommunitySeedService, CommunityFactory],
})
export class CommunitySeedModule {}
