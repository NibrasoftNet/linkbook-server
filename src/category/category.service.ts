import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { categoryPaginationConfig } from './config/category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { FilesService } from '../files/files.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly fileService: FilesService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(
      createCategoryDto as Partial<Category>,
    );
    return await this.categoryRepository.save(category);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Category>> {
    return await paginate(
      query,
      this.categoryRepository,
      categoryPaginationConfig,
    );
  }

  async findAllCategories(): Promise<{ label: string; value: string }[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select('DISTINCT category.name AS label, category.id AS value')
      .getRawMany();
  }

  async findOne(
    field: FindOptionsWhere<Category>,
    relations?: FindOptionsRelations<Category>,
  ): Promise<NullableType<Category>> {
    return await this.categoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Category>,
    relations?: FindOptionsRelations<Category>,
  ): Promise<Category> {
    return await this.categoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneOrFail({ id });
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOneOrFail({ id });
    if (category.image) {
      await this.fileService.deleteFile(category.image.path);
    }
    return await this.categoryRepository.delete(id);
  }
}
