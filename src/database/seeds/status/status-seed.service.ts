import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../statuses/entities/status.entity';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { Repository } from 'typeorm';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(Status)
    private repository: Repository<Status>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.ACTIVE,
          name: 'ACTIVE',
        }),
        this.repository.create({
          id: StatusEnum.INACTIVE,
          name: 'INACTIVE',
        }),
      ]);
    }
  }
}
