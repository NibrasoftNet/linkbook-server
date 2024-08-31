import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Category } from '../entities/category.entity';

export const categoryPaginationConfig: PaginateConfig<Category> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['products', 'image'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
