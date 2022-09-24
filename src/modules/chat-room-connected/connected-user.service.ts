import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserConnected } from './entities/user-connected.entity';
import { createConnectedUserDto } from './dto/create-connected-user.dto';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(UserConnected)
    private readonly connectedUserRepository: Repository<UserConnected>,
  ) {}

  async create(data: createConnectedUserDto): Promise<UserConnected> {
    return await this.connectedUserRepository.save({
      socketId: data.socketId,
      user: { id: data.userId },
    });
  }

  async findByUser(id: number): Promise<UserConnected[]> {
    return await this.connectedUserRepository.findBy({ user: { id } });
  }

  async deleteBySocketId(socketId: string): Promise<DeleteResult> {
    return await this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll(): Promise<DeleteResult> {
    return await this.connectedUserRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }
}
