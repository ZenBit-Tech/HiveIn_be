import { forwardRef, Inject, Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { MessageService } from 'src/modules/message/message.service';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';
import redisClient from 'src/modules/redis/redis';

config();

enum Event {
  ROOMS = 'rooms',
  ROOM = 'room',
  ERROR = 'error',
  GET_ROOMS = 'getRooms',
  JOIN_ROOM = 'joinRoom',
  MESSAGES = 'messages',
  GET_MESSAGES = 'getMessages',
  LEAVE_ROOM = 'leaveRoom',
  ADD_MESSAGE = 'addMessage',
  MESSAGE_ADDED = 'messageAdded',
  GET_COUNT_NOTIFICATIONS = 'getCount',
  GET_NOTIFICATIONS = 'getNotifications',
  GET_MESSAGE_NOTIFICATION = 'getMessageNotification',
  MARK_AS_READ_NOTIFICATION = 'markAsRead',
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
    private readonly jwtService: JwtService,
    private readonly userService: SettingsInfoService,
    private readonly roomService: ChatRoomService,
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,
  ) {}

  private redisClient = redisClient;
  private logger: Logger = new Logger('AppGateway');

  async onModuleInit(): Promise<void> {
    this.logger.log('Ws module initialized');
    await this.redisClient.FLUSHALL();
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
        return this.disconnectUnauthorized(socket);
      } else {
        await this.redisClient.HSET('users', socket.id, user.id);
        const rooms = await this.roomService.getAllByUserId(user.id);
        this.server.to(socket.id).emit(Event.ROOMS, rooms);
      }
    } catch {
      this.logger.error('Error occurred in ws handleConnection method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException(
            'Error on initial connection. User will be disconnected',
          ),
        );
      return await this.handleDisconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    try {
      await this.redisClient.HDEL('users', socket.id);
      const rooms = await this.redisClient.KEYS('room*');
      rooms.map(async (room) => await this.redisClient.SREM(room, socket.id));
    } catch (error) {
      this.logger.error('Error occurred in ws handleDisconnect method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException(
            'Internal error while disconnecting user. User disconnected',
          ),
        );
    } finally {
      socket.disconnect();
      this.logger.log('🚀🔴 Disconnected');
    }
  }

  private disconnectUnauthorized(socket: Socket): void {
    this.server
      .to(socket.id)
      .emit(
        Event.ERROR,
        new WsException('Unauthorized user. Wrong token. User disconnected'),
      );
    socket.disconnect();
  }

  @SubscribeMessage(Event.GET_ROOMS)
  async onGetRooms(socket: Socket | { id: string }): Promise<void> {
    try {
      const userId = await this.redisClient.HGET('users', socket.id);
      const rooms = await this.roomService.getAllByUserId(+userId);
      this.server.to(socket.id).emit(Event.ROOMS, rooms);
    } catch (error) {
      this.logger.error('Error occurred in ws onGetRooms method');
      this.server
        .to(socket.id)
        .emit(Event.ERROR, new WsException('Error while trying to get rooms'));
    }
  }

  @SubscribeMessage(Event.JOIN_ROOM)
  async onJoinRoom(socket: Socket, data: number): Promise<void> {
    try {
      const messages = await this.messageService.getAllByRoomId(data);
      const currentRoom = await this.roomService.getOneById(data);
      const currentUser = await this.redisClient.HGET('users', socket.id);

      if (
        +currentUser !== currentRoom.freelancer.id &&
        +currentUser !== currentRoom.client.id
      )
        throw new WsException(
          'User trying to join to room which he not belongs',
        );
      await this.redisClient.SADD(`room${data}`, socket.id);

      this.server.to(socket.id).emit(Event.MESSAGES, messages);
      this.server.to(socket.id).emit(Event.ROOM, currentRoom);
    } catch (error) {
      this.logger.error('Error occurred in ws onJoinRoom method');
      if (error instanceof WsException)
        this.server
          .to(socket.id)
          .emit(
            Event.ERROR,
            new WsException(
              "Error while trying to join room. Most likely user don't belong to this room",
            ),
          );
      this.server
        .to(socket.id)
        .emit(Event.ERROR, new WsException('Error while trying to join room'));
    }
  }

  private async checkUser(socketId: string, roomId: number): Promise<boolean> {
    try {
      const currentRoom = await this.roomService.getOneById(roomId);
      const currentUser = await this.redisClient.HGET('users', socketId);

      return (
        +currentUser === currentRoom.freelancer.id ||
        +currentUser === currentRoom.client.id
      );
    } catch (error) {
      this.logger.error('Error occurred in ws checkUser method');
      throw new WsException('Internal server error');
    }
  }

  @SubscribeMessage(Event.GET_MESSAGES)
  async onGetMessage(socket: Socket, data: number): Promise<void> {
    try {
      const currentRoom = await this.roomService.getOneById(data);
      const isUserBelongToRoom = await this.checkUser(
        socket.id,
        currentRoom.id,
      );

      if (!isUserBelongToRoom)
        throw new WsException(
          'User trying to join to room which he not belongs',
        );

      const messages = await this.messageService.getAllByRoomId(data);
      this.server.to(socket.id).emit(Event.MESSAGES, messages);
    } catch (error) {
      this.logger.error('Error occurred in ws onGetMessage method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to get messages'),
        );
    }
  }

  @SubscribeMessage(Event.LEAVE_ROOM)
  async onLeaveRoom(socket: Socket, data: number): Promise<void> {
    try {
      await this.redisClient.SREM(`room${data}`, socket.id);
    } catch (error) {
      this.logger.error('Error occurred in ws onLeaveRoom method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to leave rooms'),
        );
    }
  }

  @SubscribeMessage(Event.ADD_MESSAGE)
  async onAddMessage(
    socket: Socket,
    data: { chatRoomId: number; text: string },
  ): Promise<void> {
    try {
      const userId = await this.redisClient.HGET('users', socket.id);
      const createdMessage = await this.messageService.create({
        ...data,
        userId: +userId,
      });
      const room = await this.roomService.getOneById(
        createdMessage.chatRoom.id,
      );

      const usersInRoom = [room.freelancer.id, room.client.id];
      const allUsersInRoom = new Set<string>();
      const users = await this.redisClient.HGETALL('users');
      Object.keys(users).forEach((socketId) => {
        if (usersInRoom.includes(+users[socketId]))
          allUsersInRoom.add(socketId);
      });

      for (const user of allUsersInRoom) {
        this.server.to(user).emit(Event.MESSAGE_ADDED, createdMessage);
        const userInRedis = await this.redisClient.HGET('users', user);

        const rooms = await this.roomService.getAllByUserId(+userInRedis);
        this.server.to(user).emit(Event.ROOMS, rooms);
      }

      const joinedUsers = await this.redisClient.SMEMBERS(
        `room${data.chatRoomId}`,
      );

      const messages = await this.messageService.getAllByRoomId(
        data.chatRoomId,
      );

      joinedUsers.map((user) => {
        this.server.to(user).emit(Event.MESSAGES, messages);
        this.server.to(user).emit(Event.ROOM, room);
      });
    } catch (error) {
      this.logger.error('Error occurred in ws onAddMessage method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to add message'),
        );
    }
  }

  @SubscribeMessage(Event.GET_COUNT_NOTIFICATIONS)
  async onGetCount(socket: Socket | { id: string }): Promise<void> {
    try {
      const user = await this.redisClient.HGET('users', socket.id);
      const countOfNotification = await this.notificationService.getCount(
        +user,
      );
      this.server
        .to(socket.id)
        .emit(Event.GET_COUNT_NOTIFICATIONS, countOfNotification);
    } catch (error) {
      this.logger.error('Error occurred in ws onGetCount method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to get count of notifications'),
        );
    }
  }

  @SubscribeMessage(Event.GET_NOTIFICATIONS)
  async onGetNotifications(socket: Socket | { id: string }): Promise<void> {
    try {
      const user = await this.redisClient.HGET('users', socket.id);
      const notifications =
        await this.notificationService.getAllOwnNotMessageType(+user);
      this.server.to(socket.id).emit(Event.GET_NOTIFICATIONS, notifications);
    } catch (error) {
      this.logger.error('Error occurred in ws onGetNotifications method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to get notifications'),
        );
    }
  }

  @SubscribeMessage(Event.GET_MESSAGE_NOTIFICATION)
  async onGetMessageNotification(
    socket: Socket | { id: string },
  ): Promise<void> {
    try {
      const user = await this.redisClient.HGET('users', socket.id);
      const notifications = await this.notificationService.getAllOwnMessageType(
        +user,
        false,
      );
      this.server
        .to(socket.id)
        .emit(Event.GET_MESSAGE_NOTIFICATION, notifications);
    } catch (error) {
      this.logger.error('Error occurred in ws onGetMessageNotification method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to get message notifications'),
        );
    }
  }

  @SubscribeMessage(Event.MARK_AS_READ_NOTIFICATION)
  async onMarkAsRead(socket: Socket, data: number[]): Promise<void> {
    try {
      await this.notificationService.markAsRead(data);
      await this.onGetCount(socket);
      await this.onGetNotifications(socket);
      await this.onGetMessageNotification(socket);
    } catch {
      this.logger.error('Error occurred in ws onMarkAsRead method');
      this.server
        .to(socket.id)
        .emit(
          Event.ERROR,
          new WsException('Error while trying to update notification'),
        );
    }
  }

  async onAddNotification(id: number): Promise<void> {
    try {
      const users = await this.redisClient.HGETALL('users');
      Object.keys(users).map(async (user) => {
        const userToEmit = { id: user };
        if (Number(users[user]) === id) {
          await this.onGetCount(userToEmit);
          await this.onGetNotifications(userToEmit);
          await this.onGetMessageNotification(userToEmit);
          await this.onGetRooms(userToEmit);
        }
      });
    } catch (error) {
      this.logger.error('Error occurred in ws onAddNotification method');
      throw new WsException('Error while trying to add notification');
    }
  }
}
