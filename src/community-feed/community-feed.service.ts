import { Injectable } from '@nestjs/common';
import { CreateCommunityFeedDto } from './dto/create-community-feed.dto';
import { UpdateCommunityFeedDto } from './dto/update-community-feed.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityFeed } from './entities/community-feed.entity';
import {
  Brackets,
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { UsersService } from '../users/users.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { communityFeedPaginationConfig } from './config/comminity-feed-pagination-config';
import { CommunityFeedDto } from './dto/community-feed.dto';
import { NullableType } from '../utils/types/nullable.type';
import { CommunityService } from '../community/community.service';
import { CommunitySubscriptionStatusEnum } from '../applicant-to-community/enums/community-subscription-status.enum';

@Injectable()
export class CommunityFeedService {
  constructor(
    @InjectRepository(CommunityFeed)
    private readonly communityFeedRepository: Repository<CommunityFeed>,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly communityService: CommunityService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    createCommunityFeedDto: CreateCommunityFeedDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<CommunityFeed> {
    const { communityId, ...filteredCreateCommunityFeedDto } =
      createCommunityFeedDto;
    const communityFeed = this.communityFeedRepository.create(
      filteredCreateCommunityFeedDto as DeepPartial<CommunityFeed>,
    );
    communityFeed.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    communityFeed.community = await this.communityService.findOneOrFail({
      id: communityId,
    });
    if (files) {
      communityFeed.image = await this.filesService.uploadMultipleFiles(files);
    }
    return await this.communityFeedRepository.save(communityFeed);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.communityFeedRepository,
      communityFeedPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.communityFeedRepository
      .createQueryBuilder('communityFeed')
      .leftJoinAndSelect('communityFeed.community', 'community')
      .leftJoinAndSelect('community.creator', 'creator')
      .leftJoinAndSelect('community.image', 'image')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, communityFeedPaginationConfig);
  }

  async findAllRelatedMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.communityFeedRepository
      .createQueryBuilder('communityFeed')
      .leftJoinAndSelect('communityFeed.community', 'community')
      .leftJoinAndSelect('community.subscribers', 'subscribers')
      .leftJoinAndSelect('community.image', 'image')
      .leftJoinAndSelect('subscribers.subscriber', 'subscriber')
      .where(
        new Brackets((qb) => {
          // Public communities are always included
          qb.where('community.isPrivate = :isNotPublic', {
            isNotPublic: false,
          })
            // Private communities where the user is an accepted subscriber
            .orWhere(
              new Brackets((privateQb) => {
                privateQb
                  .where('community.isPrivate = :isPrivate', {
                    isPrivate: true,
                  })
                  .andWhere('subscribers.status = :status', {
                    status: CommunitySubscriptionStatusEnum.ACCEPTED,
                  })
                  .andWhere('subscriber.id = :id', { id: userJwtPayload.id });
              }),
            );
        }),
      );

    return await paginate(query, queryBuilder, communityFeedPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<CommunityFeed>,
    relations?: FindOptionsRelations<CommunityFeedDto>,
  ): Promise<NullableType<CommunityFeed>> {
    return await this.communityFeedRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<CommunityFeed>,
    relations?: FindOptionsRelations<CommunityFeedDto>,
  ): Promise<CommunityFeed> {
    return await this.communityFeedRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: number, updateCommunityFeedDto: UpdateCommunityFeedDto) {
    const communityFeed = await this.findOneOrFail({ id });
    Object.assign(communityFeed, updateCommunityFeedDto);
    return await this.communityFeedRepository.save(communityFeed);
  }

  async remove(id: number) {
    return await this.communityFeedRepository.delete(id);
  }
}
