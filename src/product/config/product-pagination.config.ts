import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Product } from '../entities/product.entity';

export const productPaginationConfig: PaginateConfig<Product> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['image', 'category', 'category.image'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  defaultLimit: 1000,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    type: [FilterOperator.EQ, FilterSuffix.NOT],
    name: [FilterOperator.ILIKE, FilterOperator.EQ, FilterSuffix.NOT],
    'category.id': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
