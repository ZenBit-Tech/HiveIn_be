import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { createChatRoomDto } from 'src/modules/chat-room/dto/create-chat-room.dto';
import { UserRole, Users } from 'src/modules/entities/users.entity';

enum RowNames {
  CLIENT = 'client_user_profile',
  FREELANCER = 'freelancer_user_profile',
  CHAT_ROOM = 'chat_room',
  JOB_POST = 'job_post',
}

type TArgs = {
  rowName: RowNames;
  id: number;
};

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(data: createChatRoomDto): Promise<ChatRoom> {
    return this.chatRoomRepository.save({
      offer: { id: data.offerId },
    });
  }

  async getOneById(id: number): Promise<ChatRoom> {
    const chatRoom = await this.get({
      rowName: RowNames.CHAT_ROOM,
      id,
    }).getOne();

    if (!chatRoom) throw new NotFoundException();

    return chatRoom;
  }

  async getAllByJobPostId(id: number): Promise<ChatRoom[]> {
    return await this.get({ rowName: RowNames.JOB_POST, id }).getMany();
  }

  async getAllByUserId(id: number): Promise<ChatRoom[]> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();
    if (user.role === UserRole.UNDEFINED) throw new ForbiddenException();

    return await this.get({
      rowName:
        user.role === UserRole.CLIENT ? RowNames.CLIENT : RowNames.FREELANCER,
      id,
    }).getMany();
  }

  get({ rowName, id }: TArgs): SelectQueryBuilder<ChatRoom> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .leftJoinAndSelect(
        'chat_room.offer',
        'offer',
        'chat_room.offer = offer.id',
      )
      .leftJoinAndSelect(
        'offer.jobPost',
        'job_post',
        'offer.jobPostId = job_post.id',
      )
      .leftJoinAndSelect(
        'offer.freelancer',
        'freelancer',
        'offer.freelancerId = freelancer.id',
      )
      .leftJoinAndSelect(
        'job_post.user',
        'client_user_profile',
        'job_post.userId = client_user_profile.id',
      )
      .leftJoinAndSelect(
        'freelancer.user',
        'freelancer_user_profile',
        'freelancer.user = freelancer_user_profile.id',
      )
      .where(`${rowName}.id = ${id}`);
  }
}
