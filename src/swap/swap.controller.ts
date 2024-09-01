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
  UploadedFiles,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
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
import { Public } from '../utils/validators/public.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { swapPaginationConfig } from './config/swap-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Swap } from './entities/swap.entity';
import { SwapDto } from './dto/swap.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { validateOrReject } from 'class-validator';

@ApiTags('Swaps')
@ApiBearerAuth()
@Controller({ version: '1', path: 'swaps' })
export class SwapController {
  constructor(
    private readonly swapService: SwapService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateSwapDto)
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
          $ref: getSchemaPath(CreateSwapDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Swap, SwapDto))
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File | Express.MulterS3.File>,
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
  ) {
    const createSwapDto = new CreateSwapDto(data);
    await validateOrReject(createSwapDto);
    return await this.swapService.create(request.user, files, createSwapDto);
  }

  @ApiPaginationQuery(swapPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list/subscribed')
  async findAll(@Paginate() query: PaginateQuery) {
    const swaps = await this.swapService.findAll(query);
    return new PaginatedDto<Swap, SwapDto>(this.mapper, swaps, Swap, SwapDto);
  }

  @ApiPaginationQuery(swapPaginationConfig)
  @Get('list/unsubscribed')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAllUnsubscribed(@Paginate() query: PaginateQuery) {
    const swaps = await this.swapService.findAll(query);
    return new PaginatedDto<Swap, SwapDto>(this.mapper, swaps, Swap, SwapDto);
  }

  @ApiPaginationQuery(swapPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Swap, SwapDto>> {
    const swaps = await this.swapService.findAllMe(request.user, query);
    return new PaginatedDto<Swap, SwapDto>(this.mapper, swaps, Swap, SwapDto);
  }

  @ApiPaginationQuery(swapPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/others')
  @HttpCode(HttpStatus.OK)
  async findAllOthers(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Swap, SwapDto>> {
    const swaps = await this.swapService.findAllOthers(request.user, query);
    return new PaginatedDto<Swap, SwapDto>(this.mapper, swaps, Swap, SwapDto);
  }

  @ApiPaginationQuery(swapPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list-requested/_me')
  @HttpCode(HttpStatus.OK)
  async findAllRequestMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Swap, SwapDto>> {
    const swaps = await this.swapService.findAllRequestedMe(
      request.user,
      query,
    );
    return new PaginatedDto<Swap, SwapDto>(this.mapper, swaps, Swap, SwapDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Swap, SwapDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.swapService.findOne(
      { id: +id },
      {
        applicants: { applicant: true },
        product: { image: true },
        creator: true,
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Swap, SwapDto))
  @UseInterceptors(FilesInterceptor('data'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body('data', ParseFormdataPipe) data) {
    const updateSwapDto = new UpdateSwapDto(data);
    await validateOrReject(updateSwapDto);
    return this.swapService.update(+id, updateSwapDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.swapService.remove(+id);
  }
}
