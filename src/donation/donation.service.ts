import { Injectable } from '@nestjs/common';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { donationPaginationConfig } from './config/donation-pagination-config';
import { AddressService } from '../address/address.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductTypeEnum } from '../product/enum/product-type.enum';
import { NullableType } from '../utils/types/nullable.type';
import { Utils } from '../utils/utils';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly usersService: UsersService,
    private readonly productService: ProductService,
    private readonly addressService: AddressService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    files: Array<Express.Multer.File | Express.MulterS3.File>,
    createDonationDto: CreateDonationDto,
  ) {
    const donation = this.donationRepository.create(
      createDonationDto as DeepPartial<Donation>,
    );
    donation.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const product = new CreateProductDto(createDonationDto.product);
    product.type = ProductTypeEnum.DONATIONS;
    await Utils.validateDtoOrFail(product);
    donation.product = await this.productService.create(files, product);
    donation.address = await this.addressService.create(
      createDonationDto.address,
    );
    return await this.donationRepository.save(donation);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.donationRepository,
      donationPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, donationPaginationConfig);
  }

  async findAllOthers(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.creator', 'creator')
      .where('creator.id <> :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, donationPaginationConfig);
  }

  async findAllRequestedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.applicants', 'applicants')
      .leftJoinAndSelect('applicants.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, donationPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Donation>,
    relations?: FindOptionsRelations<Donation>,
  ): Promise<NullableType<Donation>> {
    return await this.donationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Donation>,
    relations?: FindOptionsRelations<Donation>,
  ): Promise<Donation> {
    return await this.donationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: number, updateDonationDto: UpdateDonationDto) {
    const donation = await this.findOneOrFail({ id });
    const { product, ...filteredDonationDto } = updateDonationDto;
    if (product) {
      donation.product = await this.productService.update(
        donation.product.id,
        product,
      );
    }
    Object.assign(donation, filteredDonationDto);
    return await this.donationRepository.save(donation);
  }

  async remove(id: number) {
    return await this.donationRepository.delete(id);
  }
}
