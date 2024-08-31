import { Module } from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryController } from './search-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { UsersModule } from '../users/users.module';
import { SearchHistorySerializationProfile } from './serialization/search-history-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistory]), UsersModule],
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService, SearchHistorySerializationProfile],
})
export class SearchHistoryModule {}
