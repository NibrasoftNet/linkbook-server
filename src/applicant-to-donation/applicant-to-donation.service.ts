import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateApplicantToDonationDto } from './dto/update-applicant-to-donation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantToDonation } from './entities/applicant-to-donation.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { Donation } from '../donation/entities/donation.entity';
import { DonationStatusEnum } from './enums/donation-status.enum';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { applicantToDonationPaginationConfig } from './config/applicant-to-donation-pagination-config';

@Injectable()
export class ApplicantToDonationService {
  constructor(
    @InjectRepository(ApplicantToDonation)
    private readonly applicantToDonationRepository: Repository<ApplicantToDonation>,
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async create(id: number, userJwtPayload: JwtPayloadType) {
    const applicantToDonation = await this.findOne({
      donation: { id },
      applicant: { id: userJwtPayload.id },
    });
    if (applicantToDonation) {
      throw new UnprocessableEntityException(
        `{"donation": "${this.i18n.t('donation.alreadyApplied', { lang: I18nContext.current()?.lang })}"}`,
      );
    }
    const applicant = this.applicantToDonationRepository.create();
    applicant.applicant = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    applicant.donation = await this.donationRepository.findOneOrFail({
      where: { id, active: true, creator: { id: Not(userJwtPayload.id) } },
    });
    return await this.applicantToDonationRepository.save(applicant);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.applicantToDonationRepository,
      applicantToDonationPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.applicantToDonationRepository
      .createQueryBuilder('applicantToDonation')
      .leftJoinAndSelect('applicantToDonation.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(
      query,
      queryBuilder,
      applicantToDonationPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<ApplicantToDonation>,
    relations?: FindOptionsRelations<ApplicantToDonation>,
  ) {
    return await this.applicantToDonationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ApplicantToDonation>,
    relations?: FindOptionsRelations<ApplicantToDonation>,
  ) {
    return await this.applicantToDonationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async approve(id: string) {
    await this.applicantToDonationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Step 1: Find the applicant to get the related donation ID
        const applicant = await entityManager.findOneOrFail(
          ApplicantToDonation,
          {
            where: { id },
            relations: ['donation'],
          },
        );

        // Step 2: Approve the selected applicant
        applicant.status = DonationStatusEnum.ACCEPTED;
        await entityManager.save(applicant);

        // Step 3: Reject all other applicants with the same donationId
        await entityManager.update(
          ApplicantToDonation,
          {
            donation: { id: applicant.donation.id },
            id: Not(id),
          },
          {
            status: DonationStatusEnum.REJECTED,
          },
        );

        // Step 4: Update the donation status to active = false
        await entityManager.update(Donation, applicant.donation.id, {
          active: false,
        });
      },
    );
  }

  async reject(id: string) {
    const applicant = await this.findOneOrFail({ id });
    applicant.status = DonationStatusEnum.REJECTED;
    return await this.applicantToDonationRepository.save(applicant);
  }

  async update(
    id: string,
    updateApplicantToDonationDto: UpdateApplicantToDonationDto,
  ) {
    const applicant = await this.findOneOrFail({ id });
    Object.assign(applicant, updateApplicantToDonationDto);
    return await this.applicantToDonationRepository.save(applicant);
  }

  async cancelMyRequest(id: string, userJwtPayload: JwtPayloadType) {
    const applicant = await this.findOneOrFail({
      id,
      applicant: { id: userJwtPayload.id },
    });
    applicant.status = DonationStatusEnum.CANCELLED;
    return await this.applicantToDonationRepository.save(applicant);
  }

  async remove(id: string) {
    return await this.applicantToDonationRepository.delete(id);
  }
}
