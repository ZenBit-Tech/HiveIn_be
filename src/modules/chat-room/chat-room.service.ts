import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { createChatRoomDto } from 'src/modules/chat-room/dto/create-chat-room.dto';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import {
  chatRoomStatus,
  ColumnNames,
  IRoom,
  TArgs,
} from 'src/modules/chat-room/typesDef';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(data: createChatRoomDto): Promise<ChatRoom> {
    return await this.chatRoomRepository.save({
      jobPost: { id: data.jobPostId },
      freelancer: { id: data.freelancerId },
      status: data.status,
    });
  }

  async getOneById(id: number): Promise<IRoom> {
    const chatRoom = await this.get({
      columnName: ColumnNames.CHAT_ROOM,
      id,
    }).getOne();

    if (!chatRoom) throw new NotFoundException();

    return this.parseChatRoomData(chatRoom);
  }

  async getAllByJobPostId(id: number): Promise<ChatRoom[]> {
    return await this.get({ columnName: ColumnNames.JOB_POST, id }).getMany();
  }

  async getAllByUserId(id: number): Promise<IRoom[]> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();
    if (user.role === UserRole.UNDEFINED) throw new ForbiddenException();

    const rooms = await this.get({
      columnName:
        user.role === UserRole.CLIENT
          ? ColumnNames.CLIENT
          : ColumnNames.FREELANCER,
      id,
    }).getMany();

    return rooms.map((room) => this.parseChatRoomData(room));
  }

  async changeStatus(id: number): Promise<UpdateResult> {
    return await this.chatRoomRepository
      .createQueryBuilder()
      .update(ChatRoom)
      .set({ status: chatRoomStatus.FOR_ALL })
      .where('id = :id', { id })
      .execute();
  }

  private get({ columnName, id }: TArgs): SelectQueryBuilder<ChatRoom> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .leftJoinAndSelect('chat_room.message', 'message')
      .leftJoinAndSelect('chat_room.jobPost', 'job_post')
      .leftJoinAndSelect('chat_room.freelancer', 'freelancer')
      .leftJoinAndSelect('job_post.user', 'client_user_profile')
      .leftJoinAndSelect('freelancer.user', 'freelancer_user_profile')
      .where(`${columnName}.id = ${id}`);
  }

  private parseChatRoomData(chatRoom: ChatRoom): IRoom {
    const freelancer = {
      id: chatRoom.freelancer.user.id,
      firstName: chatRoom.freelancer.user.firstName,
      lastName: chatRoom.freelancer.user.lastName,
      avatarURL: chatRoom.freelancer.user.avatarURL,
    };

    const client = {
      id: chatRoom.jobPost.user.id,
      firstName: chatRoom.jobPost.user.firstName,
      lastName: chatRoom.jobPost.user.lastName,
      avatarURL: chatRoom.jobPost.user.avatarURL,
    };

    const jobPost = {
      id: chatRoom.jobPost.id,
      title: chatRoom.jobPost.title,
    };

    const lastMessage = chatRoom.message.pop();

    return {
      id: chatRoom.id,
      status: chatRoom.status,
      freelancer,
      client,
      lastMessage,
      jobPost,
    };
  }
}
