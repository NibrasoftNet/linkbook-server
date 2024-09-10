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
  UnprocessableEntityException,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
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
import { donationPaginationConfig } from './config/donation-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Donation } from './entities/donation.entity';
import { DonationDto } from './dto/donation.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Public } from '../utils/validators/public.decorator';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { Utils } from '../utils/utils';

@ApiTags('Donations')
@ApiBearerAuth()
@Controller({ version: '1', path: 'donations' })
export class DonationController {
  constructor(
    private readonly donationService: DonationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateDonationDto)
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
          $ref: getSchemaPath(CreateDonationDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Donation, DonationDto))
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @UploadedFiles() files: Array<Express.Multer.File | Express.MulterS3.File>,
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
  ) {
    try {
      const createDonationDto = new CreateDonationDto(data);
      await Utils.validateDtoOrFail(createDonationDto);

      return await this.donationService.create(
        request.user,
        files,
        createDonationDto,
      );
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  @ApiPaginationQuery(donationPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list/subscribed')
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Donation, DonationDto>> {
    const donations = await this.donationService.findAll(query);
    return new PaginatedDto<Donation, DonationDto>(
      this.mapper,
      donations,
      Donation,
      DonationDto,
    );
  }

  @ApiPaginationQuery(donationPaginationConfig)
  @Get('list/unsubscribed')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAllUnsubscribed(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Donation, DonationDto>> {
    const donations = await this.donationService.findAll(query);
    return new PaginatedDto<Donation, DonationDto>(
      this.mapper,
      donations,
      Donation,
      DonationDto,
    );
  }

  @ApiPaginationQuery(donationPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Donation, DonationDto>> {
    const donations = await this.donationService.findAllMe(request.user, query);
    return new PaginatedDto<Donation, DonationDto>(
      this.mapper,
      donations,
      Donation,
      DonationDto,
    );
  }

  @ApiPaginationQuery(donationPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/others')
  @HttpCode(HttpStatus.OK)
  async findAllOthers(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Donation, DonationDto>> {
    const donations = await this.donationService.findAllOthers(
      request.user,
      query,
    );
    return new PaginatedDto<Donation, DonationDto>(
      this.mapper,
      donations,
      Donation,
      DonationDto,
    );
  }

  @ApiPaginationQuery(donationPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list-requested/_me')
  @HttpCode(HttpStatus.OK)
  async findAllRequestMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Donation, DonationDto>> {
    const donations = await this.donationService.findAllRequestedMe(
      request.user,
      query,
    );
    return new PaginatedDto<Donation, DonationDto>(
      this.mapper,
      donations,
      Donation,
      DonationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Donation, DonationDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('product/:id')
  async findOneByProductId(@Param('id') id: string) {
    return await this.donationService.findOneOrFail(
      {
        product: { id: +id },
      },
      {
        applicants: { applicant: true },
        product: { image: true },
        creator: true,
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Donation, DonationDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.donationService.findOne(
      { id: +id },
      {
        applicants: { applicant: true },
        product: { image: true },
        creator: true,
      },
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Donation, DonationDto))
  @UseInterceptors(FilesInterceptor('data'))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body('data', ParseFormdataPipe) data) {
    const updateDonationDto = new UpdateDonationDto(data);
    await Utils.validateDtoOrFail(updateDonationDto);
    return this.donationService.update(+id, updateDonationDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.donationService.remove(+id);
  }
}
