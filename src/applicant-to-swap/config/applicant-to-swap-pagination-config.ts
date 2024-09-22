import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ApplicantToSwap } from '../entities/applicant-to-swap.entity';

export const applicantToSwapPaginationConfig: PaginateConfig<ApplicantToSwap> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['community', 'subscriber', 'community.creator'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt', 'status'],
    defaultLimit: 50,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
