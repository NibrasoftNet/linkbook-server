import { CommunityFactory } from './community.factory';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from '../../..//community/entities/community.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommunitySeedService {
  constructor(
    private readonly communityFactory: CommunityFactory,
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  async run(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      const community = await this.communityFactory.createRandom();
      await this.communityRepository.save(community);
    }
  }
}
