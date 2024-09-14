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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { SearchHistory } from '../search-history/entities/search-history.entity';
import { SearchHistoryDto } from '../search-history/dto/search-history.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { testimonialPaginationConfig } from './config/testimonial-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialDto } from './dto/testimonial.dto';

@ApiTags('Testimonials')
@ApiBearerAuth()
@Controller({ version: '1', path: 'testimonials' })
export class TestimonialsController {
  constructor(
    private readonly testimonialsService: TestimonialsService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.STOREADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body() createTestimonialDto: CreateTestimonialDto,
  ) {
    return await this.testimonialsService.create(
      request.user,
      createTestimonialDto,
    );
  }

  @ApiPaginationQuery(testimonialPaginationConfig)
  @UseInterceptors(
    MapInterceptor(SearchHistory, SearchHistoryDto, { isArray: true }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Testimonial, TestimonialDto>> {
    const testimonials = await this.testimonialsService.findAll(query);
    return new PaginatedDto<Testimonial, TestimonialDto>(
      this.mapper,
      testimonials,
      Testimonial,
      TestimonialDto,
    );
  }

  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.testimonialsService.findOne({ id: +id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.USER, RoleEnum.ADMIN, RoleEnum.STOREADMIN)
  @UseInterceptors(MapInterceptor(SearchHistory, SearchHistoryDto))
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(+id, updateTestimonialDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.testimonialsService.remove(+id);
  }
}
