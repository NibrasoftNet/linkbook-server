import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Testimonial } from '../entities/testimonial.entity';

export const testimonialPaginationConfig: PaginateConfig<Testimonial> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['user', 'user.image'],
  searchableColumns: ['rate'],
  sortableColumns: ['createdAt', 'updatedAt'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};