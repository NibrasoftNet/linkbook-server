import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Store } from '../entities/store.entity';

export const storePaginationConfig: PaginateConfig<Store> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['tenants', 'image', 'address'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    active: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
  },
};
