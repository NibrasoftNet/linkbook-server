import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { AddressModule } from '../address/address.module';
import { UsersModule } from '../users/users.module';
import { StoreSerializationProfile } from './serialization/store-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), AddressModule, UsersModule],
  controllers: [StoreController],
  providers: [StoreService, StoreSerializationProfile],
  exports: [StoreService],
})
export class StoreModule {}
