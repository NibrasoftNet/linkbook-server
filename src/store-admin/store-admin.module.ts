import { Module } from '@nestjs/common';
import { StoreAdminService } from './store-admin.service';
import { StoreAdminController } from './store-admin.controller';
import { StoreAdminSerializationProfile } from './serialization/store-admin-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreAdmin } from './entities/store-admin.entity';
import { UsersModule } from '../users/users.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreAdmin]), UsersModule, StoreModule],
  controllers: [StoreAdminController],
  providers: [StoreAdminService, StoreAdminSerializationProfile],
})
export class StoreAdminModule {}
