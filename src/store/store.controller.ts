import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiTags } from '@nestjs/swagger';
import { Store } from './entities/store.entity';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { StoreDto } from './dto/store.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { storePaginationConfig } from './config/store-pagination.config';

@ApiTags('Store')
@Controller({ version: '1', path: 'store' })
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(Store, StoreDto))
  async create(@Body() createStoreDto: CreateStoreDto) {
    return await this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiPaginationQuery(storePaginationConfig)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Store, StoreDto>> {
    const stores = await this.storeService.findAllPaginated(query);
    return new PaginatedDto<Store, StoreDto>(
      this.mapper,
      stores,
      Store,
      StoreDto,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Store, StoreDto))
  async findOne(@Param('id') id: string): Promise<NullableType<Store>> {
    return await this.storeService.findOne({ id: +id });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Store, StoreDto))
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return await this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.storeService.remove(+id);
  }
}
