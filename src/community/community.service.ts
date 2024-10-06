import { Injectable } from '@nestjs/common';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { NullableType } from '../utils/types/nullable.type';
import { Community } from './entities/community.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { communityPaginationConfig } from './config/community-pagination-config';
import { FilesService } from '../files/files.service';
import { CommunitySubscriptionStatusEnum } from '../applicant-to-community/enums/community-subscription-status.enum';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    file: Express.Multer.File | Express.MulterS3.File,
    createCommunityDto: CreateCommunityDto,
  ) {
    const community = this.communityRepository.create(
      createCommunityDto as DeepPartial<Community>,
    );
    community.image = await this.filesService.uploadFile(file);
    community.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return await this.communityRepository.save(community);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.communityRepository,
      communityPaginationConfig,
    );
  }

  async findAllCommunities(
    userJwtPayload: JwtPayloadType,
  ): Promise<{ label: string; value: string }[]> {
    return await this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.creator', 'creator')
      .leftJoinAndSelect('community.subscribers', 'subscribers')
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
                  .andWhere(
                    new Brackets((subPrivateQb) => {
                      subPrivateQb
                        .andWhere('subscribers.status = :status', {
                          status: CommunitySubscriptionStatusEnum.ACCEPTED,
                        })
                        .andWhere('subscriber.id = :id', {
                          id: userJwtPayload.id,
                        })
                        .orWhere('creator.id = :creatorId', {
                          creatorId: userJwtPayload.id,
                        });
                    }),
                  );
              }),
            );
        }),
      )
      .select('DISTINCT community.name AS label, community.id AS value')
      .getRawMany();
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, communityPaginationConfig);
  }

  async findAllPrivateUnsubscribedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.subscribers', 'subscribers')
      .leftJoinAndSelect('subscribers.subscriber', 'subscriber')
      .where('community.isPrivate = :private', { private: true })
      .andWhere('(subscriber.id IS NULL OR subscriber.id != :id)', {
        id: userJwtPayload.id,
      });

    return await paginate(query, queryBuilder, communityPaginationConfig);
  }

  async findAllRequestedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.subscribers', 'subscribers')
      .leftJoinAndSelect('subscribers.subscriber', 'subscriber')
      .where('subscriber.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, communityPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Community>,
    relations?: FindOptionsRelations<Community>,
  ): Promise<NullableType<Community>> {
    return await this.communityRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Community>,
    relations?: FindOptionsRelations<Community>,
  ): Promise<Community> {
    return await this.communityRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: number, updateCommunityDto: UpdateCommunityDto) {
    const community = await this.findOneOrFail({ id });
    const { ...filteredCommunityDto } = updateCommunityDto;
    Object.assign(community, filteredCommunityDto);
    return await this.communityRepository.save(community);
  }

  async remove(id: number) {
    return await this.communityRepository.delete(id);
  }
}
