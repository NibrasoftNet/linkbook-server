import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { CategoryDto } from './dto/category.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Mapper } from 'automapper-core';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { categoryPaginationConfig } from './config/category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Category')
@Controller({ version: '1', path: 'category' })
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginationQuery(categoryPaginationConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Category, CategoryDto>> {
    const categories = await this.categoryService.findAll(query);
    return new PaginatedDto<Category, CategoryDto>(
      this.mapper,
      categories,
      Category,
      CategoryDto,
    );
  }

  @Get('find/all-categories')
  @HttpCode(HttpStatus.OK)
  async findAllCategories() {
    try {
      return await this.categoryService.findAllCategories();
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Category, CategoryDto))
  async findOne(@Param('id') id: string): Promise<NullableType<Category>> {
    return await this.categoryService.findOne({ id: +id }, { products: true });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Category, CategoryDto))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}
