import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ApplicantToCommunity } from '../entities/applicant-to-community.entity';

export const applicantToCommunityPaginationConfig: PaginateConfig<ApplicantToCommunity> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['community', 'community.image', 'creator'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt', 'status'],
    defaultLimit: 50,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
