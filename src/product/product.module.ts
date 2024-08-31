import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductSerializationProfile } from './serialization/product-serialization.profile';
import { StoreModule } from '../store/store.module';
import { CategoryModule } from '../category/category.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    StoreModule,
    CategoryModule,
    FilesModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductSerializationProfile],
  exports: [ProductService],
})
export class ProductModule {}
