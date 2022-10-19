import { Notification } from 'src/modules/notifications/entities/notification.entity';

export type TColumnToJoin =
  | { message: { id: number } }
  | { offer: { id: number } }
  | { proposal: { id: number } };

export interface INotificationWithRoomId extends Notification {
  roomId: number;
}

export interface ICountedNotifications {
  notifications: Notification[];
  count: number;
}

export interface ICountedParsedNotifications {
  notifications: INotificationWithRoomId[];
  count: number;
}

export interface ICountOfNotifications {
  message: number;
  other: number;
}
