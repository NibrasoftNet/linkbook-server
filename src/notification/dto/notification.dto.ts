import { NotificationTypeOfSendingEnum } from '../enum/notification-type-of-sending.enum';

import { AutoMap } from 'automapper-classes';
import { UserDto } from '../../users/dto/user.dto';

export class NotificationDto {
  @AutoMap()
  id: number;

  @AutoMap()
  title: string;

  @AutoMap()
  message: string;

  @AutoMap()
  forAllUsers: boolean;

  @AutoMap()
  typeOfSending: NotificationTypeOfSendingEnum;

  @AutoMap(() => Date)
  punctualSendDate?: Date;

  @AutoMap(() => [Date])
  scheduledNotification: Date[] | null;

  @AutoMap()
  active: boolean;

  @AutoMap(() => [UserDto])
  users?: [UserDto];

  @AutoMap()
  isNotificationSent: boolean;
}
