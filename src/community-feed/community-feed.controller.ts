import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { CommunityFeedService } from './community-feed.service';
import { CreateCommunityFeedDto } from './dto/create-community-feed.dto';
import { UpdateCommunityFeedDto } from './dto/update-community-feed.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CommunityFeed } from './entities/community-feed.entity';
import { CommunityFeedDto } from './dto/community-feed.dto';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { communityFeedPaginationConfig } from './config/comminity-feed-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';

@ApiTags('Community-feed')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'community-feeds' })
export class CommunityFeedController {
  constructor(
    private readonly communityFeedService: CommunityFeedService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCommunityFeedDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateCommunityFeedDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(CommunityFeed, CommunityFeedDto))
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CommunityFeed> {
    const createCommunityFeedDto = new CreateCommunityFeedDto(data);
    await Utils.validateDtoOrFail(createCommunityFeedDto);
    return await this.communityFeedService.create(
      request.user,
      createCommunityFeedDto,
      files,
    );
  }

  @ApiPaginationQuery(communityFeedPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    const feeds = await this.communityFeedService.findAll(query);
    return new PaginatedDto<CommunityFeed, CommunityFeedDto>(
      this.mapper,
      feeds,
      CommunityFeed,
      CommunityFeedDto,
    );
  }

  @ApiPaginationQuery(communityFeedPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('related/_me')
  async findAllRelatedMe(@Request() request, @Paginate() query: PaginateQuery) {
    const feeds = await this.communityFeedService.findAllRelatedMe(
      request.user,
      query,
    );
    return new PaginatedDto<CommunityFeed, CommunityFeedDto>(
      this.mapper,
      feeds,
      CommunityFeed,
      CommunityFeedDto,
    );
  }

  @ApiPaginationQuery(communityFeedPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('_me')
  async findAllMe(@Request() request, @Paginate() query: PaginateQuery) {
    const feeds = await this.communityFeedService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<CommunityFeed, CommunityFeedDto>(
      this.mapper,
      feeds,
      CommunityFeed,
      CommunityFeedDto,
    );
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(MapInterceptor(CommunityFeed, CommunityFeedDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.communityFeedService.findOne(
      { id: +id },
      { community: { subscribers: true } },
    );
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(MapInterceptor(CommunityFeed, CommunityFeedDto))
  @UseInterceptors(FilesInterceptor('data'))
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body('data', ParseFormdataPipe) data) {
    const updateCommunityFeedDto = new UpdateCommunityFeedDto(data);
    await Utils.validateDtoOrFail(updateCommunityFeedDto);
    return await this.communityFeedService.update(+id, updateCommunityFeedDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.communityFeedService.remove(+id);
  }
}
