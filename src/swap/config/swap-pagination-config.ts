import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Swap } from '../entities/swap.entity';

export const swapPaginationConfig: PaginateConfig<Swap> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: [
    'creator',
    'creator.photo',
    'product',
    'product.category',
    'product.image',
    'applicants',
    'applicants.product',
    'applicants.product.image',
    'applicants.applicant',
    'address',
  ],
  searchableColumns: ['description'],
  sortableColumns: ['createdAt', 'updatedAt', 'description'],
  defaultLimit: 20,
  maxLimit: 20,
  loadEagerRelations: true,
  filterableColumns: {
    active: [FilterOperator.EQ, FilterSuffix.NOT],
    name: [FilterOperator.EQ, FilterSuffix.NOT],
    'address.street': [FilterOperator.EQ, FilterSuffix.NOT],
    'product.category.id': [FilterOperator.EQ, FilterSuffix.NOT],
    'product.type': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
