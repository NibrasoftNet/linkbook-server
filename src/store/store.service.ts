import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Store } from './entities/store.entity';
import { AddressService } from '../address/address.service';
import { Address } from '../address/entities/address.entity';
import { NullableType } from '../utils/types/nullable.type';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { storePaginationConfig } from './config/store-pagination.config';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly addressService: AddressService,
  ) {}
  async create(createStoreDto: CreateStoreDto) {
    const store = this.storeRepository.create(
      createStoreDto as DeepPartial<Store>,
    );
    store.address = await this.addressService.create(
      createStoreDto.address as DeepPartial<Address>,
    );
    return await this.storeRepository.save(store);
  }

  async findAllPaginated(query: PaginateQuery): Promise<Paginated<Store>> {
    return await paginate(query, this.storeRepository, storePaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Store>,
    relations?: FindOptionsRelations<Store>,
  ): Promise<NullableType<Store>> {
    return await this.storeRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Store>,
    relations?: FindOptionsRelations<Store>,
  ): Promise<Store> {
    return await this.storeRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOneOrFail({ id }, { address: true });
    console.log('fdgfdg', updateStoreDto);
    if (store.address) {
      await this.addressService.update(
        store.address.id,
        updateStoreDto.address as DeepPartial<Address>,
      );
    }
    Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(store);
  }

  async remove(id: number) {
    return await this.storeRepository.delete(id);
  }
}
