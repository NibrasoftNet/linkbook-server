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
import { StoreAdminService } from './store-admin.service';
import { CreateStoreAdminDto } from './dto/create-store-admin.dto';
import { UpdateStoreAdminDto } from './dto/update-store-admin.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { StoreAdminDto } from './store-admin.dto';
import { StoreAdmin } from './entities/store-admin.entity';
import { NullableType } from '../utils/types/nullable.type';

@ApiTags('Store-admin')
@ApiExcludeController()
@Controller({ version: '1', path: 'store-admin' })
export class StoreAdminController {
  constructor(
    private readonly storeAdminService: StoreAdminService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(StoreAdmin, StoreAdminDto))
  async create(@Body() createStoreAdminDto: CreateStoreAdminDto) {
    return await this.storeAdminService.create(createStoreAdminDto);
  }

  @Get()
  findAllPaginated() {
    return this.storeAdminService.findAllPaginated();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(StoreAdmin, StoreAdminDto))
  async findOne(@Param('id') id: string): Promise<NullableType<StoreAdmin>> {
    return this.storeAdminService.findOne(
      { id },
      { store: true, tenant: true },
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(StoreAdmin, StoreAdminDto))
  async update(
    @Param('id') id: string,
    @Body() updateStoreAdminDto: UpdateStoreAdminDto,
  ): Promise<StoreAdmin> {
    return await this.storeAdminService.update(id, updateStoreAdminDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.storeAdminService.remove(id);
  }
}
