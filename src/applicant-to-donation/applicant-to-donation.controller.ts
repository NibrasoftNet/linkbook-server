import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
  Request,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApplicantToDonationService } from './applicant-to-donation.service';
import { UpdateApplicantToDonationDto } from './dto/update-applicant-to-donation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ApplicantToDonation } from './entities/applicant-to-donation.entity';
import { ApplicantToDonationDto } from './dto/applicant-to-donation.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { donationPaginationConfig } from '../donation/config/donation-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { applicantToDonationPaginationConfig } from './config/applicant-to-donation-pagination-config';

@ApiBearerAuth()
@ApiTags('Applicant-to-donation')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'applicant-to-donation' })
export class ApplicantToDonationController {
  constructor(
    private readonly applicantToDonationService: ApplicantToDonationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(ApplicantToDonation, ApplicantToDonationDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Post(':id')
  async create(@Request() request, @Param('id', ParseIntPipe) id: number) {
    return await this.applicantToDonationService.create(id, request.user);
  }

  @ApiPaginationQuery(applicantToDonationPaginationConfig)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.applicantToDonationService.findAll(query);
  }

  @ApiPaginationQuery(applicantToDonationPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<ApplicantToDonation, ApplicantToDonationDto>> {
    const requestedDonations = await this.applicantToDonationService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<ApplicantToDonation, ApplicantToDonationDto>(
      this.mapper,
      requestedDonations,
      ApplicantToDonation,
      ApplicantToDonationDto,
    );
  }

  @UseInterceptors(MapInterceptor(ApplicantToDonation, ApplicantToDonationDto))
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicantToDonationService.findOne(
      { id },
      { applicant: true },
    );
  }

  @Put('accept/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async approve(@Param('id') id: string) {
    return await this.applicantToDonationService.approve(id);
  }

  @Put('reject/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async reject(@Param('id') id: string) {
    return await this.applicantToDonationService.reject(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateApplicantToDonationDto: UpdateApplicantToDonationDto,
  ) {
    return await this.applicantToDonationService.update(
      id,
      updateApplicantToDonationDto,
    );
  }

  @Put('cancel/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async cancelMyRequest(@Request() request, @Param('id') id: string) {
    try {
      return await this.applicantToDonationService.cancelMyRequest(
        id,
        request.user,
      );
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.applicantToDonationService.remove(id);
  }
}
