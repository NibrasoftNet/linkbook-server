import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateApplicantToCommunityDto } from './dto/update-applicant-to-community.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantToCommunity } from './entities/applicant-to-community.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { applicantToCommunityPaginationConfig } from './config/applicant-to-community-pagination-config';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationTypeOfSendingEnum } from '../notification/enum/notification-type-of-sending.enum';
import { Community } from '../community/entities/community.entity';
import { CommunitySubscriptionStatusEnum } from './enums/community-subscription-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicantToCommunityService {
  constructor(
    @InjectRepository(ApplicantToCommunity)
    private readonly applicantToCommunityRepository: Repository<ApplicantToCommunity>,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    private readonly usersService: UsersService,
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
    const applicantToCommunity = this.applicantToCommunityRepository.create();
    applicantToCommunity.community =
      await this.communityRepository.findOneOrFail({
        where: { id },
      });
    applicantToCommunity.subscriber = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return await this.applicantToCommunityRepository.save(applicantToCommunity);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.applicantToCommunityRepository,
      applicantToCommunityPaginationConfig,
    );
  }

  async findAllRequestedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.applicantToCommunityRepository
      .createQueryBuilder('applicantToCommunity')
      .leftJoinAndSelect('applicantToCommunity.subscriber', 'subscriber')
      .where('subscriber.id = :id', { id: userJwtPayload.id });

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
    // Step 1: Find the applicant to get the related Community ID
    const applicantToCommunity = await this.findOneOrFail(
      { id },
      { subscriber: true, community: { creator: true } },
    );
    // Step 2: Approve the selected applicant and send accept notification
    applicantToCommunity.status = CommunitySubscriptionStatusEnum.ACCEPTED;
    await this.applicantToCommunityRepository.save(applicantToCommunity);
    const createNotificationDto = new CreateNotificationDto({
      title: 'Community join Accepted',
      message: `${applicantToCommunity.community.creator.firstName} accepted your request.`,
      forAllUsers: false,
      users: [applicantToCommunity.subscriber],
      typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
    });
    applicantToCommunity.subscriber.notificationsToken &&
      (await this.notificationService.create(createNotificationDto));
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
