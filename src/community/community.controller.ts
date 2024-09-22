import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { CreateCommunityDto } from './dto/create-community.dto';
import { Community } from './entities/community.entity';
import { communityPaginationConfig } from './config/community-pagination-config';
import { CommunityDto } from './dto/community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';

@ApiTags('Community')
@ApiBearerAuth()
@Controller({ version: '1', path: 'communities' })
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateCommunityDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'object',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateCommunityDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Community, CommunityDto))
  @UseInterceptors(FileInterceptor('file'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
  ) {
    const createCommunityDto = new CreateCommunityDto(data);
    await Utils.validateDtoOrFail(createCommunityDto);

    return await this.communityService.create(
      request.user,
      file,
      createCommunityDto,
    );
  }

  @ApiPaginationQuery(communityPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Community, CommunityDto>> {
    const communities = await this.communityService.findAll(query);
    return new PaginatedDto<Community, CommunityDto>(
      this.mapper,
      communities,
      Community,
      CommunityDto,
    );
  }

  @ApiPaginationQuery(communityPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Community, CommunityDto>> {
    const communities = await this.communityService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<Community, CommunityDto>(
      this.mapper,
      communities,
      Community,
      CommunityDto,
    );
  }

  @ApiPaginationQuery(communityPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list-private-unsubscribed/_me')
  @HttpCode(HttpStatus.OK)
  async findAllPrivateUnsubscribedMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Community, CommunityDto>> {
    const communities =
      await this.communityService.findAllPrivateUnsubscribedMe(
        request.user,
        query,
      );
    return new PaginatedDto<Community, CommunityDto>(
      this.mapper,
      communities,
      Community,
      CommunityDto,
    );
  }

  @ApiPaginationQuery(communityPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list-requested/_me')
  @HttpCode(HttpStatus.OK)
  async findAllRequestMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Community, CommunityDto>> {
    const donations = await this.communityService.findAllRequestedMe(
      request.user,
      query,
    );
    return new PaginatedDto<Community, CommunityDto>(
      this.mapper,
      donations,
      Community,
      CommunityDto,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Community, CommunityDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.communityService.findOne(
      { id: +id },
      {
        creator: true,
        subscribers: { subscriber: true },
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Community, CommunityDto))
  @UseInterceptors(FilesInterceptor('data'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body('data', ParseFormdataPipe) data) {
    const updateDonationDto = new UpdateCommunityDto(data);
    await Utils.validateDtoOrFail(updateDonationDto);
    return this.communityService.update(+id, updateDonationDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.communityService.remove(+id);
  }
}
