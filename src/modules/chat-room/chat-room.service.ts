import { MONTHS_IN_HALF_YEAR, SALT_ROUND } from 'src/utils/jwt.consts';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { createChatRoomDto } from 'src/modules/chat-room/dto/create-chat-room.dto';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import {
  chatRoomStatus,
  ColumnNames,
  IChatRoom,
  IFreelancer,
  IRoom,
  IUser,
  TArgs,
} from 'src/modules/chat-room/typesDef';
import { Message } from 'src/modules/message/entities/message.entity';
import { OfferService } from 'src/modules/offer/offer.service';
import { MessageService } from 'src/modules/message/message.service';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @Inject(forwardRef(() => OfferService))
    private offerService: OfferService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async create(data: createChatRoomDto): Promise<ChatRoom> {
    try {
      return await this.chatRoomRepository.save({
        jobPost: { id: data.jobPostId },
        freelancer: { id: data.freelancerId },
        status: data.status,
      });
    } catch (error) {
      Logger.error(
        'Error occurred while creating chat room. Chat room not created',
      );
      throw new UnprocessableEntityException();
    }
  }

  async getOneById(id: number): Promise<IRoom> {
    try {
      const chatRoom = await this.get({
        columnName: ColumnNames.CHAT_ROOM,
        id,
      }).getOne();

      if (!chatRoom) throw new NotFoundException();

      return await this.parseChatRoomData(chatRoom);
    } catch (error) {
      if (error instanceof NotFoundException) {
        Logger.error(
          'Error occurred while finding chat room in db. Chat room not found',
        );
        throw new NotFoundException(error);
      }
      Logger.error(
        'Unexpected error occurred while finding chat room in db or parsing returned data',
      );
      throw new ServiceUnavailableException();
    }
  }

  async getAllByJobPostId(id: number): Promise<ChatRoom[]> {
    try {
      return await this.get({ columnName: ColumnNames.JOB_POST, id }).getMany();
    } catch (error) {
      Logger.error('Unexpected error occurred while finding chat rooms in db');
      throw new ServiceUnavailableException();
    }
  }

  async getAllByUserId(id: number): Promise<IRoom[]> {
    try {
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

      return await Promise.all(
        rooms.map(async (room) => await this.parseChatRoomData(room)),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        Logger.error(
          "Error occurred while finding chat rooms in db. Most likely that is wrong user's id",
        );
        throw new NotFoundException();
      }
      if (error instanceof ForbiddenException) {
        Logger.error(
          "Error occurred while finding chat rooms in db. Most likely that is wrong user's role",
        );
        throw new ForbiddenException(error);
      }
      Logger.error('Unexpected error occurred while finding chat rooms in db');
      throw new ServiceUnavailableException();
    }
  }

  async updateAfterReceiveMessage(id: number): Promise<UpdateResult> {
    try {
      return await this.chatRoomRepository
        .createQueryBuilder()
        .update(ChatRoom)
        .set({ updated_at: new Date() })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      Logger.error('Error occurred while trying to update chat room');
      throw new UnprocessableEntityException();
    }
  }

  async changeStatus(id: number): Promise<UpdateResult> {
    try {
      return await this.chatRoomRepository
        .createQueryBuilder()
        .update(ChatRoom)
        .set({ status: chatRoomStatus.FOR_ALL, updated_at: new Date() })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      Logger.error("Error occurred while trying to update chat room's status");
      throw new UnprocessableEntityException();
    }
  }

  private get({ columnName, id }: TArgs): SelectQueryBuilder<ChatRoom> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .leftJoinAndSelect('chat_room.message', 'message')
      .leftJoinAndSelect('chat_room.jobPost', 'job_post')
      .leftJoinAndSelect('chat_room.freelancer', 'freelancer')
      .leftJoinAndSelect('job_post.user', 'client_user_profile')
      .leftJoinAndSelect('freelancer.user', 'freelancer_user_profile')
      .where(`${columnName}.id = ${id}`)
      .orderBy('updated_at', 'DESC');
  }

  async getRoomIdByJobPostAndFreelancerIds(
    jobPostId: number,
    freelancerId: number,
  ): Promise<number> {
    try {
      const room = await this.chatRoomRepository
        .createQueryBuilder('chat_room')
        .leftJoin('chat_room.jobPost', 'jobPost')
        .leftJoin('chat_room.freelancer', 'freelancer')
        .where(`jobPost.id = ${jobPostId}`)
        .andWhere(`freelancer.id = ${freelancerId}`)
        .getOneOrFail();

      return room.id;
    } catch (error) {
      Logger.error(
        'Error occurred while trying to find room in db. Most likely that is wrong jobPostId/freelancerId or there is no chat room with this parameters',
      );
      throw new UnprocessableEntityException();
    }
  }

  async getRoomIdByMessageId(id: number): Promise<number> {
    try {
      const room = await this.chatRoomRepository
        .createQueryBuilder('chat_room')
        .leftJoin('chat_room.message', 'message')
        .where('message.id = :id', { id })
        .getOneOrFail();

      return room.id;
    } catch (error) {
      Logger.error('Unexpected error while finding chat room id by message id');
      throw new UnprocessableEntityException();
    }
  }

  async prolongChat(id: number, token: string): Promise<UpdateResult> {
    const salt = await genSalt(SALT_ROUND);
    const prolongLink = await hash('prolong' + id, salt);

    const result = await this.chatRoomRepository
      .createQueryBuilder()
      .update(ChatRoom)
      .set({
        deleteDate: new Date(
          new Date().setMonth(new Date().getMonth() + MONTHS_IN_HALF_YEAR),
        ),
        prolongLink,
      })
      .where('id = :id', { id })
      .andWhere('prolongLink = :token', { token })
      .execute();
    return result;
  }

  private async parseChatRoomData(chatRoom: ChatRoom): Promise<IRoom> {
    try {
      const offer = await this.offerService.getOneByFreelancerIdAndJobPostId(
        chatRoom.freelancer.id,
        chatRoom.jobPost.id,
      );

      const offerStatus = offer ? offer.status : null;

      const freelancer: IFreelancer = {
        id: chatRoom.freelancer.user.id,
        firstName: chatRoom.freelancer.user.firstName,
        lastName: chatRoom.freelancer.user.lastName,
        avatarURL: chatRoom.freelancer.user.avatar.url,
        freelancerId: chatRoom.freelancer.id,
      };

      const client: IUser = {
        id: chatRoom.jobPost.user.id,
        firstName: chatRoom.jobPost.user.firstName,
        lastName: chatRoom.jobPost.user.lastName,
        avatarURL: chatRoom.jobPost.user.avatar.url,
      };

      const jobPost: IChatRoom = {
        id: chatRoom.jobPost.id,
        title: chatRoom.jobPost.title,
      };

      const lastMessage: Message = chatRoom?.message?.pop();
      return {
        id: chatRoom.id,
        status: chatRoom.status,
        freelancer,
        client,
        lastMessage,
        jobPost,
        offerStatus,
      };
    } catch (error) {
      Logger.error('Error occurred while parsing chat room data');
      throw new UnprocessableEntityException();
    }
  }
}
