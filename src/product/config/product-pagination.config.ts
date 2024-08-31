import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Product } from '../entities/product.entity';

export const productPaginationConfig: PaginateConfig<Product> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['image', 'category', 'category.image'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    type: [FilterOperator.EQ, FilterSuffix.NOT],
    'category.id': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
