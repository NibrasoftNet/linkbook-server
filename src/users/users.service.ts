import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { AddressService } from '../address/address.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './configs/users-pagination.config';
import { StatusEnum } from '../statuses/statuses.enum';
import { Status } from '../statuses/entities/status.entity';
import {
  runOnTransactionComplete,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional';
import { FilesService } from '../files/files.service';
import { AuthUpdateDto } from '../auth/dto/auth-update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly addressService: AddressService,
    private fileService: FilesService,
  ) {}
  @Transactional()
  async create(createProfileDto: CreateUserDto): Promise<User> {
    runOnTransactionRollback(() =>
      console.log(`Create User transaction rolled back`),
    );
    runOnTransactionComplete((error) => {
      if (!!error) {
        console.log(`Create User transaction failed`);
      }
      console.log(`Create User transaction completed`);
    });
    const user = this.usersRepository.create(createProfileDto);

    if (!!createProfileDto.address) {
      user.address = await this.addressService.create(createProfileDto.address);
    }
    if (!createProfileDto.status) {
      user.status = { id: StatusEnum.INACTIVE } as Status;
    }

    if (createProfileDto.notificationsToken != null) {
      return await this.usersRepository.save(user);
    }
    return await this.usersRepository.save(user);
  }

  async findManyWithPagination(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.usersRepository, usersPaginationConfig);
  }

  async findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.usersRepository.findOne({
      where: fields,
      relations: {
        address: true,
      },
    });
  }

  async findOneOrFail(
    fields: EntityCondition<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: fields,
      relations,
    });
  }

  async update(
    id: number,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id: id });
    const { address, ...filteredUserDto } = updateUserDto;
    if (!!address) {
      user.address = await this.addressService.update(
        user.address!.id,
        address,
      );
    }
    if (!!files) {
      user.photo = user?.photo?.id
        ? await this.fileService.updateFile(files, user?.photo?.path)
        : await this.fileService.uploadFile(files);
    }
    Object.assign(user, filteredUserDto);
    return this.usersRepository.save(user);
  }

  /*  async addStoreToUser(tenantId: number, store: Store): Promise<User> {
    const user = await this.findOneOrFail({ id: tenantId });
    //user.store = store;
    return await this.usersRepository.save(user);
  }*/

  // This method is used by user and admin
  async softDelete(id: User['id']): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(id);
  }

  async countBy(fields?: FindOptionsWhere<User>): Promise<number> {
    return await this.usersRepository.count({ where: fields });
  }

  async restoreUserByEmail(email: User['email']): Promise<User | null> {
    // Find the user by email, including soft-deleted ones
    const user = await this.usersRepository.findOne({
      withDeleted: true,
      where: { email },
    });

    if (user && user.deletedAt) {
      // If the user is found and is soft-deleted, restore the user
      await this.usersRepository.restore(user.id);
      return user;
    }
    // Return null if no user was found or the user was not deleted
    return null;
  }

  // async findRoleById(roleId: number): Promise<Role | null> {
  //   return this.rolesRepository.findOne({ where: { id: roleId } });
  // }
}
