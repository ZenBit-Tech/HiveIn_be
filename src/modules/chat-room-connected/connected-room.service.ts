import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomConnected } from './entities/chat-room-connected.entity';
import { createConnectedUserDto } from './dto/create-connected-room.dto';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(ChatRoomConnected)
    private readonly chatRoomConnectedRepository: Repository<ChatRoomConnected>,
  ) {}

  async create(data: createConnectedUserDto): Promise<ChatRoomConnected> {
    const { socketId, roomId, userId } = data;
    return this.chatRoomConnectedRepository.save({
      socketId: socketId,
      user: { id: userId },
      room: { id: roomId },
    });
  }

  async findByUser(id: number) {
    return this.chatRoomConnectedRepository.findBy({ user: { id } });
  }

  async findByRoom(id: number) {
    return this.chatRoomConnectedRepository.findBy({ room: { id } });
  }

  async deleteBySocketId(socketId: string) {
    return this.chatRoomConnectedRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.chatRoomConnectedRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
