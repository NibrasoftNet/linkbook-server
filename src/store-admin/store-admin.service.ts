import { Injectable } from '@nestjs/common';
import { CreateStoreAdminDto } from './dto/create-store-admin.dto';
import { UpdateStoreAdminDto } from './dto/update-store-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreAdmin } from './entities/store-admin.entity';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { StoreService } from '../store/store.service';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class StoreAdminService {
  constructor(
    @InjectRepository(StoreAdmin)
    private readonly storeAdminRepository: Repository<StoreAdmin>,
    private readonly userService: UsersService,
    private readonly storeService: StoreService,
  ) {}
  async create(createStoreAdminDto: CreateStoreAdminDto) {
    const storeAdmin = this.storeAdminRepository.create(
      createStoreAdminDto as DeepPartial<StoreAdmin>,
    );
    storeAdmin.store = await this.storeService.findOneOrFail({
      id: createStoreAdminDto.storeId,
    });
    storeAdmin.tenant = await this.userService.findOneOrFail({
      id: createStoreAdminDto.tenantId,
    });
    return await this.storeAdminRepository.save(storeAdmin);
  }

  async findAllPaginated() {
    return await this.storeAdminRepository.find();
  }

  async findOne(
    field: FindOptionsWhere<StoreAdmin>,
    relations?: FindOptionsRelations<StoreAdmin>,
  ): Promise<NullableType<StoreAdmin>> {
    return await this.storeAdminRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<StoreAdmin>,
    relations?: FindOptionsRelations<StoreAdmin>,
  ): Promise<StoreAdmin> {
    return await this.storeAdminRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateStoreAdminDto: UpdateStoreAdminDto,
  ): Promise<StoreAdmin> {
    const storeAdmin = await this.findOneOrFail(
      { id },
      { store: true, tenant: true },
    );
    if (updateStoreAdminDto.storeId) {
      storeAdmin.store = await this.storeService.findOneOrFail({
        id: updateStoreAdminDto.storeId,
      });
    }
    if (updateStoreAdminDto.tenantId) {
      storeAdmin.tenant = await this.userService.findOneOrFail({
        id: updateStoreAdminDto.tenantId,
      });
    }
    Object.assign(storeAdmin, updateStoreAdminDto);
    return await this.storeAdminRepository.save(storeAdmin);
  }

  async remove(id: string) {
    return await this.storeAdminRepository.delete(id);
  }
}
