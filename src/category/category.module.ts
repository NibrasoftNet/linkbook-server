import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategorySerializationProfile } from './serialization/category-serialization.profile';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), FilesModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategorySerializationProfile],
  exports: [CategoryService],
})
export class CategoryModule {}
