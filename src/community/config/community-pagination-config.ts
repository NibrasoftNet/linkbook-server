import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Community } from '../entities/community.entity';

export const communityPaginationConfig: PaginateConfig<Community> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['creator', 'creator.photo', 'subscribers'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  defaultLimit: 20,
  maxLimit: 20,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
