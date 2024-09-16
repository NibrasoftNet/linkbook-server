import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateApplicantToSwapDto } from './dto/update-applicant-to-swap.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ApplicantToSwap } from './entities/applicant-to-swap.entity';
import { Swap } from '../swap/entities/swap.entity';
import { applicantToSwapPaginationConfig } from './config/applicant-to-swap-pagination-config';
import { SwapStatusEnum } from './enums/swap-status.enum';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { CreateApplicantToSwapDto } from './dto/create-applicant-to-swap.dto';
import { ProductTypeEnum } from '../product/enum/product-type.enum';
import { Utils } from '../utils/utils';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationTypeOfSendingEnum } from '../notification/enum/notification-type-of-sending.enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ApplicantToSwapService {
  constructor(
    @InjectRepository(ApplicantToSwap)
    private readonly applicantToSwapRepository: Repository<ApplicantToSwap>,
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
    private readonly i18n: I18nService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createApplicantToSwapDto: CreateApplicantToSwapDto,
    id: number,
    userJwtPayload: JwtPayloadType,
    files: Array<Express.Multer.File | Express.MulterS3.File>,
  ) {
    const applicantToSwap = await this.findOne({
      swap: { id },
      applicant: { id: userJwtPayload.id },
    });
    if (applicantToSwap) {
      throw new UnprocessableEntityException(
        `{"donation": "${this.i18n.t('donation.alreadyApplied', { lang: I18nContext.current()?.lang })}"}`,
      );
    }
    const applicant = this.applicantToSwapRepository.create();
    applicant.applicant = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    applicant.swap = await this.swapRepository.findOneOrFail({
      where: { id, active: true, creator: { id: Not(userJwtPayload.id) } },
    });
    const product = new CreateProductDto(createApplicantToSwapDto.product);
    product.type = ProductTypeEnum.SWAPS;
    await Utils.validateDtoOrFail(product);
    applicant.product = await this.productService.create(files, product);
    return await this.applicantToSwapRepository.save(applicant);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.applicantToSwapRepository,
      applicantToSwapPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.applicantToSwapRepository
      .createQueryBuilder('applicantToSwap')
      .leftJoinAndSelect('applicantToSwap.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, applicantToSwapPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<ApplicantToSwap>,
    relations?: FindOptionsRelations<ApplicantToSwap>,
  ) {
    return await this.applicantToSwapRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ApplicantToSwap>,
    relations?: FindOptionsRelations<ApplicantToSwap>,
  ) {
    return await this.applicantToSwapRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async approve(id: string) {
    await this.applicantToSwapRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Step 1: Find the applicant to get the related swap ID
        const applicant = await entityManager.findOneOrFail(ApplicantToSwap, {
          where: { id },
          relations: { swap: true, applicant: true },
        });

        // Step 2: Approve the selected applicant
        applicant.status = SwapStatusEnum.ACCEPTED;
        await entityManager.save(applicant);
        const createNotificationDto = new CreateNotificationDto({
          title: 'Swap Accepted',
          message: 'Swap has been accepted',
          forAllUsers: false,
          users: [applicant.applicant],
          typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
        });
        await this.notificationService.create(createNotificationDto);

        // Step 3: Reject all other applicants with the same swapId
        await entityManager.update(
          ApplicantToSwap,
          {
            swap: { id: applicant.swap.id },
            id: Not(id),
          },
          {
            status: SwapStatusEnum.REJECTED,
          },
        );

        // Step 4: Update the donation status to active = false
        await entityManager.update(Swap, applicant.swap.id, {
          active: false,
        });
      },
    );
  }

  async reject(id: string) {
    const applicant = await this.findOneOrFail({ id });
    applicant.status = SwapStatusEnum.REJECTED;
    return await this.applicantToSwapRepository.save(applicant);
  }

  async update(id: string, updateApplicantToSwapDto: UpdateApplicantToSwapDto) {
    const applicant = await this.findOneOrFail({ id });
    Object.assign(applicant, updateApplicantToSwapDto);
    return await this.applicantToSwapRepository.save(applicant);
  }

  async cancelMyRequest(id: string, userJwtPayload: JwtPayloadType) {
    const applicant = await this.findOneOrFail({
      id,
      applicant: { id: userJwtPayload.id },
    });
    applicant.status = SwapStatusEnum.CANCELLED;
    return await this.applicantToSwapRepository.save(applicant);
  }

  async remove(id: string) {
    return await this.applicantToSwapRepository.delete(id);
  }
}
