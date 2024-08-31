import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../../roles/entities/role.entity';
import { RoleEnum } from '../../../roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleEnum.ADMIN,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.ADMIN,
          name: 'ADMIN',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleEnum.USER,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.USER,
          name: 'USER',
        }),
      );
    }

    const countCollectivity = await this.repository.count({
      where: {
        id: RoleEnum.STOREADMIN,
      },
    });

    if (!countCollectivity) {
      await this.repository.save(
        this.repository.create({
          id: RoleEnum.STOREADMIN,
          name: 'STOREADMIN',
        }),
      );
    }
  }
}
