import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { CommunityFeed } from '../entities/community-feed.entity';

export const communityFeedPaginationConfig: PaginateConfig<CommunityFeed> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['creator', 'image'],
  searchableColumns: ['title'],
  sortableColumns: ['createdAt', 'updatedAt', 'title'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
