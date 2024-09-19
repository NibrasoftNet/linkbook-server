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
import { ApplicantToCommunityService } from './applicant-to-community.service';
import { UpdateApplicantToCommunityDto } from './dto/update-applicant-to-community.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ApplicantToCommunityDto } from './dto/applicant-to-community.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { applicantToCommunityPaginationConfig } from './config/applicant-to-community-pagination-config';
import { ApplicantToCommunity } from './entities/applicant-to-community.entity';

@ApiBearerAuth()
@ApiTags('Applicant-to-community')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'applicant-to-community' })
export class ApplicantToCommunityController {
  constructor(
    private readonly applicantToCommunityService: ApplicantToCommunityService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(
    MapInterceptor(ApplicantToCommunity, ApplicantToCommunityDto),
  )
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Post(':id')
  async create(@Request() request, @Param('id', ParseIntPipe) id: number) {
    return await this.applicantToCommunityService.create(id, request.user);
  }

  @ApiPaginationQuery(applicantToCommunityPaginationConfig)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.applicantToCommunityService.findAll(query);
  }

  @ApiPaginationQuery(applicantToCommunityPaginationConfig)
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<ApplicantToCommunity, ApplicantToCommunityDto>> {
    const requestedCommunities =
      await this.applicantToCommunityService.findAllMe(request.user, query);
    return new PaginatedDto<ApplicantToCommunity, ApplicantToCommunityDto>(
      this.mapper,
      requestedCommunities,
      ApplicantToCommunity,
      ApplicantToCommunityDto,
    );
  }

  @UseInterceptors(
    MapInterceptor(ApplicantToCommunity, ApplicantToCommunityDto),
  )
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.applicantToCommunityService.findOne({ id });
  }

  @Put('accept/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async approve(@Param('id') id: string) {
    return await this.applicantToCommunityService.approve(id);
  }

  @Put('reject/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async reject(@Param('id') id: string) {
    return await this.applicantToCommunityService.reject(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateApplicantToCommunityDto: UpdateApplicantToCommunityDto,
  ) {
    return await this.applicantToCommunityService.update(
      id,
      updateApplicantToCommunityDto,
    );
  }

  @Put('cancel/:id')
  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  async cancelMyRequest(@Request() request, @Param('id') id: string) {
    return await this.applicantToCommunityService.cancelMyRequest(id);
  }

  @Roles(RoleEnum.STOREADMIN, RoleEnum.USER, RoleEnum.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.applicantToCommunityService.remove(id);
  }
}
