import { Injectable } from '@nestjs/common';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';
import { Swap } from './entities/swap.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { swapPaginationConfig } from './config/swap-pagination-config';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductTypeEnum } from '../product/enum/product-type.enum';
import { AddressService } from '../address/address.service';
import { NullableType } from '../utils/types/nullable.type';
import { Utils } from '../utils/utils';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
    private readonly addressService: AddressService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    files: Array<Express.Multer.File | Express.MulterS3.File>,
    createSwapDto: CreateSwapDto,
  ) {
    const swap = this.swapRepository.create(createSwapDto as DeepPartial<Swap>);
    swap.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const product = new CreateProductDto(createSwapDto.product);
    product.type = ProductTypeEnum.SWAPS;
    await Utils.validateDtoOrFail(product);
    swap.product = await this.productService.create(files, product);
    swap.address = await this.addressService.create(createSwapDto.address);
    await this.swapRepository.save(swap);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.swapRepository, swapPaginationConfig);
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, swapPaginationConfig);
  }

  async findAllOthers(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.creator', 'creator')
      .where('creator.id <> :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, swapPaginationConfig);
  }

  async findAllRequestedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.applicants', 'applicants')
      .leftJoinAndSelect('applicants.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, swapPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Swap>,
    relations?: FindOptionsRelations<Swap>,
  ): Promise<NullableType<Swap>> {
    return await this.swapRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Swap>,
    relations?: FindOptionsRelations<Swap>,
  ): Promise<Swap> {
    return await this.swapRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: number, updateSwapDto: UpdateSwapDto) {
    const swap = await this.findOneOrFail({ id });
    const { product, ...filteredSwapDto } = updateSwapDto;
    if (product) {
      swap.product = await this.productService.update(swap.product.id, product);
    }
    Object.assign(swap, filteredSwapDto);
    return await this.swapRepository.save(swap);
  }

  async remove(id: number) {
    return await this.swapRepository.delete(id);
  }
}
