import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ApplicantToDonation } from '../entities/applicant-to-donation.entity';

export const applicantToDonationPaginationConfig: PaginateConfig<ApplicantToDonation> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['donation', 'applicant', 'donation.creator'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt', 'status'],
    defaultLimit: 50,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
