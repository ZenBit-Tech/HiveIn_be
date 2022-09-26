import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ChatRoomConnected } from 'src/modules/chat-room-connected/entities/chat-room-connected.entity';
import { createConnectedUserDto } from 'src/modules/chat-room-connected/dto/create-connected-room.dto';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(ChatRoomConnected)
    private readonly chatRoomConnectedRepository: Repository<ChatRoomConnected>,
  ) {}

  async create(data: createConnectedUserDto): Promise<ChatRoomConnected> {
    const { socketId, roomId, userId } = data;
    return await this.chatRoomConnectedRepository.save({
      socketId: socketId,
      user: { id: userId },
      room: { id: roomId },
    });
  }

  async findByUser(id: number): Promise<ChatRoomConnected[]> {
    return await this.chatRoomConnectedRepository.findBy({ user: { id } });
  }

  async findByRoom(id: number): Promise<ChatRoomConnected[]> {
    return await this.chatRoomConnectedRepository.findBy({ room: { id } });
  }

  async deleteBySocketId(socketId: string): Promise<DeleteResult> {
    return await this.chatRoomConnectedRepository.delete({ socketId });
  }

  async deleteAll(): Promise<DeleteResult> {
    return await this.chatRoomConnectedRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
