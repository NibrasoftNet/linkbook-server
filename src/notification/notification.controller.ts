import { WinstonLoggerService } from '../logger/winston-logger.service';
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
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Notification } from './entities/notification.entity';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { NotificationDto } from './dto/notification.dto';
import { notificationsPaginationConfig } from './configs/notifications-pagination.config';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: WinstonLoggerService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Post()
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    try {
      return await this.notificationService.create(createNotificationDto);
    } catch (error) {
      this.logger.error(`create`, {
        description: `Failed to create Notification`,
        class: NotificationService.name,
        function: 'create',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(Notification, NotificationDto, { isArray: true }),
  )
  @ApiPaginationQuery(notificationsPaginationConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Notification, NotificationDto>> {
    try {
      const notifications =
        await this.notificationService.findAllPaginated(query);
      return new PaginatedDto<Notification, NotificationDto>(
        this.mapper,
        notifications,
        Notification,
        NotificationDto,
      );
    } catch (error) {
      this.logger.error(`findAll`, {
        description: `Failed to find All Notifications`,
        class: NotificationService.name,
        function: 'findAll',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Get('all/_me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(Notification, NotificationDto, { isArray: true }),
  )
  @ApiPaginationQuery(notificationsPaginationConfig)
  async findAllMyNotifications(
    @Request() request: any,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Notification, NotificationDto>> {
    try {
      const notifications =
        await this.notificationService.findAllMyNotifications(
          request.user,
          query,
        );
      return new PaginatedDto<Notification, NotificationDto>(
        this.mapper,
        notifications,
        Notification,
        NotificationDto,
      );
    } catch (error) {
      this.logger.error(`find-All-My-Notifications`, {
        description: `Failed to find All My Notifications`,
        class: NotificationService.name,
        function: 'findAllMyNotifications',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Get(':id')
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.notificationService.findOne(
        { id: id },
        { users: true },
      );
    } catch (error) {
      this.logger.error(`find-One-Notification`, {
        description: `Failed to find One Notification`,
        class: NotificationService.name,
        function: 'findOne',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @ApiQuery({ name: 'userId', required: false })
  @Get('send/:id')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.notificationService.sendPushNotifications(id);
    } catch (error) {
      this.logger.error(`send-Notification`, {
        description: `Failed to send Notification`,
        class: NotificationService.name,
        function: 'sendNotification',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    try {
      return await this.notificationService.update(id, updateNotificationDto);
    } catch (error) {
      this.logger.error(`update-Notification`, {
        description: `Failed to update Notification`,
        class: NotificationService.name,
        function: 'update',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.STOREADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.notificationService.remove(id);
    } catch (error) {
      this.logger.error(`remove-Notification`, {
        description: `Failed to remove Notification`,
        class: NotificationService.name,
        function: 'remove',
        error: error,
      });
      throw new HttpResponseException(error);
    }
  }
}
