import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { SearchHistory } from '../entities/search-history.entity';

export const searchHistoryPaginationConfig: PaginateConfig<SearchHistory> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['user', 'user.photo'],
  searchableColumns: ['user.email', 'brand', 'model', 'referenceNumber'],
  sortableColumns: ['createdAt', 'updatedAt'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    brand: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    referenceNumber: [
      FilterOperator.EQ,
      FilterSuffix.NOT,
      FilterOperator.ILIKE,
    ],
  },
};
