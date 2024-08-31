import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swap } from './entities/swap.entity';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';
import { SwapSerializationProfile } from './serialization/swap-serialization.profile';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Swap]),
    UsersModule,
    ProductModule,
    AddressModule,
  ],
  controllers: [SwapController],
  providers: [SwapService, SwapSerializationProfile],
})
export class SwapModule {}
