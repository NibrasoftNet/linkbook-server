import { NotificationMessageDto } from '../dto/notification-message.dto';

export interface NotificationJobPayload {
  message: NotificationMessageDto;
  notificationId: number;
}
