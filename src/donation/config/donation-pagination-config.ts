import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Donation } from '../entities/donation.entity';

export const donationPaginationConfig: PaginateConfig<Donation> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: [
    'creator',
    'creator.photo',
    'product',
    'product.category',
    'applicants',
    'applicants.applicant',
    'address',
  ],
  searchableColumns: ['description'],
  sortableColumns: ['createdAt', 'updatedAt', 'description'],
  defaultLimit: 2,
  maxLimit: 2,
  loadEagerRelations: true,
  filterableColumns: {
    active: [FilterOperator.EQ, FilterSuffix.NOT],
    name: [FilterOperator.EQ, FilterSuffix.NOT],
    'address.street': [FilterOperator.EQ, FilterSuffix.NOT],
    'product.category.id': [FilterOperator.EQ, FilterSuffix.NOT],
    'product.type': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};

export const donationUnsubscribedPaginationConfig: PaginateConfig<Donation> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['product', 'product.category', 'address'],
  searchableColumns: ['description'],
  sortableColumns: ['createdAt', 'updatedAt', 'description'],
  defaultLimit: 50,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    active: [FilterOperator.EQ, FilterSuffix.NOT],
    name: [FilterOperator.EQ, FilterSuffix.NOT],
    'address.city': [FilterOperator.EQ, FilterSuffix.NOT],
    'product.category.id': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
