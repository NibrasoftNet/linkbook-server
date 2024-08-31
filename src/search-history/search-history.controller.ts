import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { SearchHistory } from './entities/search-history.entity';
import { SearchHistoryDto } from './dto/search-history.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { searchHistoryPaginationConfig } from './config/search-history-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { SearchByUrlDto } from './dto/search-by-url.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { SearchResultResponse } from './response/search-result.response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'search' })
export class SearchHistoryController {
  constructor(
    private readonly searchHistoryService: SearchHistoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post()
  async create(
    @Request() request,
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    try {
      return await this.searchHistoryService.create(request.user, file);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN)
  @Post('product/list')
  async searchList(@Body() searchProductDto: SearchProductDto) {
    try {
      return await this.searchHistoryService.searchList(searchProductDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('with/url')
  @HttpCode(HttpStatus.OK)
  async createWithImageUrl(
    @Request() request,
    @Body() searchByUrlDto: SearchByUrlDto,
  ): Promise<SearchResultResponse | null> {
    try {
      return await this.searchHistoryService.createWithImageUrl(
        request.user,
        searchByUrlDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Post('with/open-ai/url')
  async createWithImageOpenAiUrl(
    @Request() request,
    @Body() searchByUrlDto: SearchByUrlDto,
  ) {
    try {
      return await this.searchHistoryService.createWithImageOpenAiUrl(
        request.user,
        searchByUrlDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get()
  @ApiPaginationQuery(searchHistoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  async findAllPaginated(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<SearchHistory, SearchHistoryDto>> {
    try {
      const histories = await this.searchHistoryService.findAllPaginated(query);
      return new PaginatedDto<SearchHistory, SearchHistoryDto>(
        this.mapper,
        histories,
        SearchHistory,
        SearchHistoryDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get('_me/history')
  @ApiPaginationQuery(searchHistoryPaginationConfig)
  @HttpCode(HttpStatus.OK)
  async findAllMePaginated(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<SearchHistory, SearchHistoryDto>> {
    try {
      const histories = await this.searchHistoryService.findAllMePaginated(
        request.user,
        query,
      );
      return new PaginatedDto<SearchHistory, SearchHistoryDto>(
        this.mapper,
        histories,
        SearchHistory,
        SearchHistoryDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  async findOne(@Param('id') id: string): Promise<NullableType<SearchHistory>> {
    try {
      return await this.searchHistoryService.findOne({ id: +id });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  async update(
    @Param('id') id: string,
    @Body() updateSearchHistoryDto: UpdateSearchHistoryDto,
  ): Promise<SearchHistory> {
    try {
      return await this.searchHistoryService.update(
        +id,
        updateSearchHistoryDto,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    try {
      return await this.searchHistoryService.remove(+id);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
