import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateApplicantToCommunityDto } from './dto/update-applicant-to-community.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantToCommunity } from './entities/applicant-to-community.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { applicantToCommunityPaginationConfig } from './config/applicant-to-community-pagination-config';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationTypeOfSendingEnum } from '../notification/enum/notification-type-of-sending.enum';
import { Community } from '../community/entities/community.entity';
import { CommunitySubscriptionStatusEnum } from './enums/community-subscription-status.enum';

@Injectable()
export class ApplicantToCommunityService {
  constructor(
    @InjectRepository(ApplicantToCommunity)
    private readonly applicantToCommunityRepository: Repository<ApplicantToCommunity>,
    @InjectRepository(Community)
    private readonly i18n: I18nService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(id: number, userJwtPayload: JwtPayloadType) {
    const ApplicantToCommunity = await this.findOne({
      community: { id },
      subscriber: { id: userJwtPayload.id },
    });
    if (ApplicantToCommunity) {
      throw new UnprocessableEntityException(
        `{"community": "${this.i18n.t('community.alreadyApplied', { lang: I18nContext.current()?.lang })}"}`,
      );
    }
    const applicant = this.applicantToCommunityRepository.create();
    return await this.applicantToCommunityRepository.save(applicant);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.applicantToCommunityRepository,
      applicantToCommunityPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.applicantToCommunityRepository
      .createQueryBuilder('applicantToCommunity')
      .leftJoinAndSelect('applicantToCommunity.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(
      query,
      queryBuilder,
      applicantToCommunityPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<ApplicantToCommunity>,
    relations?: FindOptionsRelations<ApplicantToCommunity>,
  ) {
    return await this.applicantToCommunityRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ApplicantToCommunity>,
    relations?: FindOptionsRelations<ApplicantToCommunity>,
  ) {
    return await this.applicantToCommunityRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async approve(id: string) {
    await this.applicantToCommunityRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Step 1: Find the applicant to get the related Community ID
        const applicant = await entityManager.findOneOrFail(
          ApplicantToCommunity,
          {
            where: { id },
            relations: { community: { creator: true } },
          },
        );

        // Step 2: Approve the selected applicant and send accept notification
        applicant.status = CommunitySubscriptionStatusEnum.ACCEPTED;
        await entityManager.save(applicant);
        const createNotificationDto = new CreateNotificationDto({
          title: 'Community Accepted',
          message: `${applicant.community.creator.firstName} accepted your request.`,
          forAllUsers: false,
          users: [applicant.subscriber],
          typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
        });
        await this.notificationService.create(createNotificationDto);
      },
    );
  }

  async reject(id: string) {
    const applicant = await this.findOneOrFail({ id });
    applicant.status = CommunitySubscriptionStatusEnum.REJECTED;
    return await this.applicantToCommunityRepository.save(applicant);
  }

  async update(
    id: string,
    updateApplicantToCommunityDto: UpdateApplicantToCommunityDto,
  ) {
    const applicant = await this.findOneOrFail({ id });
    Object.assign(applicant, updateApplicantToCommunityDto);
    return await this.applicantToCommunityRepository.save(applicant);
  }

  async cancelMyRequest(id: string) {
    const applicant = await this.findOneOrFail({
      id,
    });
    applicant.status = CommunitySubscriptionStatusEnum.CANCELLED;
    return await this.applicantToCommunityRepository.save(applicant);
  }

  async remove(id: string) {
    return await this.applicantToCommunityRepository.delete(id);
  }
}
