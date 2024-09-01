import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicantToSwapService } from './applicant-to-swap.service';
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
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { ApplicantToSwap } from './entities/applicant-to-swap.entity';
import { ApplicantToSwapDto } from './dto/applicant-to-swap.dto';
import { UpdateApplicantToSwapDto } from './dto/update-applicant-to-swap.dto';
import { applicantToSwapPaginationConfig } from './config/applicant-to-swap-pagination-config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { validateOrReject } from 'class-validator';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductTypeEnum } from '../product/enum/product-type.enum';
import { CreateApplicantToSwapDto } from './dto/create-applicant-to-swap.dto';

@ApiBearerAuth()
@ApiTags('Applicant-to-swap')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'applicant-to-swap' })
export class ApplicantToSwapController {
  constructor(
    private readonly applicantToSwapService: ApplicantToSwapService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateProductDto)
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
          $ref: getSchemaPath(CreateProductDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':id')
  async create(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Array<Express.Multer.File | Express.MulterS3.File>,
    @Body('data', ParseFormdataPipe) data,
  ) {
    const createApplicantToSwapDto = new CreateApplicantToSwapDto(data);
    console.log('azerty', data);
    await validateOrReject(createApplicantToSwapDto);
    return await this.applicantToSwapService.create(
      createApplicantToSwapDto,
      id,
      request.user,
      files,
    );
  }

  @ApiPaginationQuery(applicantToSwapPaginationConfig)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.applicantToSwapService.findAll(query);
  }

  @ApiPaginationQuery(applicantToSwapPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<ApplicantToSwap, ApplicantToSwapDto>> {
    const requestedSwaps = await this.applicantToSwapService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<ApplicantToSwap, ApplicantToSwapDto>(
      this.mapper,
      requestedSwaps,
      ApplicantToSwap,
      ApplicantToSwapDto,
    );
  }

  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicantToSwapService.findOne(
      { id },
      { applicant: true },
    );
  }

  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Put('accept/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async approve(@Param('id') id: string) {
    return await this.applicantToSwapService.approve(id);
  }

  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Put('reject/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async reject(@Param('id') id: string) {
    return await this.applicantToSwapService.reject(id);
  }

  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Patch(':id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateApplicantToSwapDto: UpdateApplicantToSwapDto,
  ) {
    return await this.applicantToSwapService.update(
      id,
      updateApplicantToSwapDto,
    );
  }

  @UseInterceptors(MapInterceptor(ApplicantToSwap, ApplicantToSwapDto))
  @Put('cancel/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async cancelMyRequest(@Request() request, @Param('id') id: string) {
    return await this.applicantToSwapService.cancelMyRequest(id, request.user);
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.applicantToSwapService.remove(id);
  }
}
