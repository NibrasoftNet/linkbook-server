import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { StoreService } from '../store/store.service';
import { CategoryService } from '../category/category.service';
import { NullableType } from '../utils/types/nullable.type';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { productPaginationConfig } from './config/product-pagination.config';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductService {
  private readonly storage;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
    private readonly i18n: I18nService,
    private readonly filesService: FilesService,
  ) {
    this.storage = this.configService.getOrThrow('file.driver', {
      infer: true,
    });
  }
  async create(
    files: Array<Express.Multer.File | Express.MulterS3.File>,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    if (!files) {
      throw new UnprocessableEntityException(
        `{"file": "${this.i18n.t('file.failedUpload', { lang: I18nContext.current()?.lang })}"}`,
      );
    }
    const product = this.productRepository.create(
      createProductDto as DeepPartial<Product>,
    );
    product.category = await this.categoryService.findOneOrFail({
      id: createProductDto.categoryId,
    });
    product.image = await this.filesService.uploadMultipleFiles(files);
    return await this.productRepository.save(product);
  }

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<Product>> {
    return await paginate(
      query,
      this.productRepository,
      productPaginationConfig,
    );
  }

  async findAllPerStorePaginated(
    storeId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Product>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .where('store.id = :storeId', { storeId });
    return await paginate(query, queryBuilder, productPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Product>,
    relations?: FindOptionsRelations<Product>,
  ): Promise<NullableType<Product>> {
    return await this.productRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Product>,
    relations?: FindOptionsRelations<Product>,
  ): Promise<Product> {
    return await this.productRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOneOrFail({ id });
    const { categoryId, ...filteredProductDto } = updateProductDto;
    Object.assign(product, filteredProductDto);
    if (categoryId) {
      product.category = await this.categoryService.findOneOrFail({
        id: updateProductDto.categoryId,
      });
    }
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
