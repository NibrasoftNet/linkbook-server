import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateResult } from 'typeorm';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './configs/users-pagination.config';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { UserDto } from './dto/user.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { PaginatedDto } from '../utils/serialization/paginated.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleEnum.ADMIN)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createProfileDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.STOREADMIN, RoleEnum.USER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(UserDto, usersPaginationConfig)
  async findAllPaginated(@Paginate() query: PaginateQuery) {
    try {
      const users = await this.usersService.findManyWithPagination(query);
      return new PaginatedDto<User, UserDto>(this.mapper, users, User, UserDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NullableType<User>> {
    try {
      return await this.usersService.findOne({ id: id });
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.update(id, updateProfileDto);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    try {
      return await this.usersService.softDelete(id);
    } catch (error) {
      throw new HttpResponseException(error);
    }
  }
}
