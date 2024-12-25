import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { Status } from '../../../statuses/entities/status.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { RoleEnum } from '../../../roles/roles.enum';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { AddressFactory } from '../address/address.factory';
import { Address } from '../../../address/entities/address.entity';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(User)
    private repositoryUser: Repository<User>,
    @InjectRepository(Role)
    private repositoryRole: Repository<Role>,
    @InjectRepository(Status)
    private repositoryStatus: Repository<Status>,
    @InjectRepository(Address)
    private repositoryAddress: Repository<Address>,
    private addressFactory: AddressFactory,
  ) {}

  createRandomUser() {
    // Need for saving "this" context

    const activeStatus = {
      id: StatusEnum.ACTIVE,
      name: 'Active',
    } as Status;
    const inactiveStatus = {
      id: StatusEnum.INACTIVE,
      name: 'Inactive',
    } as Status;
    const userRole = {
      id: RoleEnum.USER,
      name: 'User',
    } as Role;
    const adminRole = {
      id: RoleEnum.ADMIN,
      name: 'Admin',
    } as Role;
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: 'H@mza12345',
      role: faker.helpers.arrayElement<Role>([userRole, adminRole]),
      status: faker.helpers.arrayElement<Status>([
        activeStatus,
        inactiveStatus,
      ]),
      address: this.addressFactory.generateRandom(),
    } as User;
  }
}
