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
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { Product } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { ApiTags } from '@nestjs/swagger';
import { NullableType } from '../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { productPaginationConfig } from './config/product-pagination.config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Products')
@Controller({ version: '1', path: 'products' })
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async create(
    files: Array<Express.Multer.File | Express.MulterS3.File>,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.create(files, createProductDto);
  }

  @Get()
  @ApiPaginationQuery(productPaginationConfig)
  @HttpCode(HttpStatus.OK)
  async findAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Product, ProductDto>> {
    const products = await this.productService.findAllPaginated(query);
    return new PaginatedDto<Product, ProductDto>(
      this.mapper,
      products,
      Product,
      ProductDto,
    );
  }

  @Get('find/all-products')
  @HttpCode(HttpStatus.OK)
  async findAllCities() {
    return await this.productService.findAllProducts();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NullableType<Product>> {
    return await this.productService.findOne({ id }, { category: true });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Product, ProductDto))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.productService.remove(+id);
  }
}
