import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { MessageService } from '../../modules/message/message.service';
import { JoinedRoomService } from '../../modules/chat-room-connected/connected-room.service';
import { ConnectedUserService } from '../../modules/chat-room-connected/connected-user.service';
import { SettingsInfoService } from '../../modules/settings-info/settings-info.service';
import { JwtService } from '@nestjs/jwt';
import { createMessageDto } from '../../modules/message/dto/create-message.dto';

enum Event {
  ROOMS = 'rooms',
  ERROR = 'error',
  GET_ROOMS = 'getRooms',
  JOIN_ROOMS = 'joinRoom',
  MESSAGES = 'messages',
  GET_MESSAGES = 'getMessages',
  LEAVE_ROOM = 'leaveRoom',
  ADD_MESSAGE = 'addMessage',
  MESSAGE_ADDED = 'messageAdded',
  NOTIFICATION = 'send-first-notification',
  NOTIFICATION_SEND = "'first-message'",
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private userService: SettingsInfoService,
    private roomService: ChatRoomService,
    private messageService: MessageService,
    private joinedRoomService: JoinedRoomService,
    private connectedUserService: ConnectedUserService,
    private notificationService: NotificationsService,
  ) {}

  private logger: Logger = new Logger('AppGateway');

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    this.logger.log('🚀🔴 Connected');
    try {
      const decodedToken = await this.jwtService.verify(
        socket.handshake.headers.authorization.split('').slice(7).join(''),
        {
          secret: process.env.SECRET_KEY,
        },
      );

      const user = await this.userService.findOne(decodedToken.sub);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        await this.connectedUserService.create({
          socketId: socket.id,
          userId: user.id,
        });
        const rooms = await this.roomService.getAllByUserId(user.id);
        return this.server.to(socket.id).emit(Event.ROOMS, rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log('🚀🔴 Disconnected');
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    await this.joinedRoomService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit(Event.ERROR, new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage(Event.GET_ROOMS)
  async onGetRooms(socket: Socket) {
    this.logger.log(socket.data);
    const rooms = await this.roomService.getAllByUserId(socket.data.user.id);
    return this.server.to(socket.id).emit(Event.ROOMS, rooms);
  }

  @SubscribeMessage(Event.JOIN_ROOMS)
  async onJoinRoom(socket: Socket, data) {
    const messages = await this.messageService.getAllByRoomId(data);
    await this.joinedRoomService.create({
      socketId: socket.id,
      userId: socket.data.user.id,
      roomId: data,
    });
    // Send last messages from Room to User
    this.server.to(socket.id).emit(Event.MESSAGES, messages);
  }

  @SubscribeMessage(Event.GET_MESSAGES)
  async onGetMessage(socket: Socket, data) {
    const messages = await this.messageService.getAllByRoomId(data);
    this.server.to(socket.id).emit(Event.MESSAGES, messages);
  }

  @SubscribeMessage(Event.LEAVE_ROOM)
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage(Event.ADD_MESSAGE)
  async onAddMessage(socket: Socket, message: createMessageDto) {
    const createdMessage = await this.messageService.create(message);
    const room = await this.roomService.getOneById(createdMessage.chatRoom.id);
    const joinedUsers = await this.joinedRoomService.findByRoom(room.id);
    for (const user of joinedUsers) {
      this.server.to(user.socketId).emit(Event.MESSAGE_ADDED, createdMessage);
      const messages = await this.messageService.getAllByRoomId(
        message.chatRoomId,
      );
      this.server.to(user.socketId).emit(Event.MESSAGES, messages);
    }
  }

  @SubscribeMessage(Event.NOTIFICATION)
  async sendFirstNotification(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateNotificationDto,
  ): Promise<void> {
    const { toUserId, fromUserId, type, id, read, fromUser } =
      await this.notificationService.create(payload);

    this.server.emit(
      Event.NOTIFICATION_SEND,
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
