import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/modules/notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class WebsocketService implements OnGatewayInit, OnGatewayDisconnect {
  constructor(private notificationService: NotificationsService) {}

  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('🚀🔴 Connected');
  }

  handleDisconnect() {
    this.logger.log('🚀🔴 Disconnected');
  }

  @SubscribeMessage('send-first-notification')
  async sendFirstNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateNotificationDto,
  ): Promise<void> {
    const { toUserId, fromUserId, type, id, read, fromUser } =
      await this.notificationService.create(payload);

    this.server.emit(
      'first-message',
      {
        id,
        read,
        toUserId,
        fromUserId,
        type,
        fromUser,
      },
      client.id,
    );
  }
}
