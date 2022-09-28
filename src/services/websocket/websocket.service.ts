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
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { MessageService } from 'src/modules/message/message.service';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';

config();

enum Event {
  ROOMS = 'rooms',
  ERROR = 'error',
  GET_ROOMS = 'getRooms',
  JOIN_ROOM = 'joinRoom',
  MESSAGES = 'messages',
  GET_MESSAGES = 'getMessages',
  LEAVE_ROOM = 'leaveRoom',
  ADD_MESSAGE = 'addMessage',
  MESSAGE_ADDED = 'messageAdded',
  NOTIFICATION = 'send-first-notification',
  NOTIFICATION_SEND = 'first-message',
}

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL],
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
    private notificationService: NotificationsService,
  ) {}

  private users = new Map<string, number>();
  private rooms = new Map<number, Set<string>>();

  private logger: Logger = new Logger('AppGateway');

  async onModuleInit(): Promise<void> {
    this.users.clear();
    this.rooms.clear();
  }

  async handleConnection(socket: Socket): Promise<void> {
    this.logger.log('🚀🔴 Connected');
    try {
      const decodedToken = await this.jwtService.verify(
        //  Removing "Bearer "
        socket.handshake.headers.authorization.slice(7),
        {
          secret: process.env.SECRET_KEY,
        },
      );

      const user = await this.userService.findOne(decodedToken.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        const rooms = await this.roomService.getAllByUserId(user.id);
        this.users.set(socket.id, user.id);
        this.server.to(socket.id).emit(Event.ROOMS, rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    this.logger.log('🚀🔴 Disconnected');
    this.users.delete(socket.id);
    this.removeUserFromRoom(socket.id);

    socket.disconnect();
  }

  private disconnect(socket: Socket): void {
    socket.emit(Event.ERROR, new UnauthorizedException());
    socket.disconnect();
  }

  private removeUserFromRoom(socketId: string): void {
    this.rooms.forEach((socketIds, roomId) => {
      if (socketIds.has(socketId)) socketIds.delete(socketId);

      if (socketIds.size === 0) this.rooms.delete(roomId);
    });
  }

  @SubscribeMessage(Event.GET_ROOMS)
  async onGetRooms(socket: Socket): Promise<void> {
    const rooms = await this.roomService.getAllByUserId(
      this.users.get(socket.id),
    );
    this.server.to(socket.id).emit(Event.ROOMS, rooms);
  }

  @SubscribeMessage(Event.JOIN_ROOM)
  async onJoinRoom(socket: Socket, data: number): Promise<void> {
    const messages = await this.messageService.getAllByRoomId(data);

    if (this.rooms.has(data)) {
      const room = this.rooms.get(data);
      room.add(socket.id);
    } else {
      this.rooms.set(data, new Set<string>().add(socket.id));
    }
    this.server.to(socket.id).emit(Event.MESSAGES, messages);
  }

  @SubscribeMessage(Event.GET_MESSAGES)
  async onGetMessage(socket: Socket, data: number): Promise<void> {
    const messages = await this.messageService.getAllByRoomId(data);
    this.server.to(socket.id).emit(Event.MESSAGES, messages);
  }

  @SubscribeMessage(Event.LEAVE_ROOM)
  onLeaveRoom(socket: Socket): void {
    this.removeUserFromRoom(socket.id);
  }

  @SubscribeMessage(Event.ADD_MESSAGE)
  async onAddMessage(
    socket: Socket,
    data: { chatRoomId: number; text: string },
  ): Promise<void> {
    const createdMessage = await this.messageService.create({
      ...data,
      userId: this.users.get(socket.id),
    });
    const room = await this.roomService.getOneById(createdMessage.chatRoom.id);

    const usersInRoom = [room.freelancer.id, room.client.id];
    const allUsersInRoom = new Set<string>();
    this.users.forEach((userId, socketId) => {
      if (usersInRoom.includes(userId)) allUsersInRoom.add(socketId);
    });

    for (const user of allUsersInRoom) {
      this.server.to(user).emit(Event.MESSAGE_ADDED, createdMessage);

      const rooms = await this.roomService.getAllByUserId(this.users.get(user));
      this.server.to(user).emit(Event.ROOMS, rooms);
    }

    const currentRoom = this.rooms.get(createdMessage.chatRoom.id);

    for (const usersInRoom of currentRoom) {
      const messages = await this.messageService.getAllByRoomId(
        data.chatRoomId,
      );

      this.server.to(usersInRoom).emit(Event.MESSAGES, messages);
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
