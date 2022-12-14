import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { genSalt, hash } from 'bcryptjs';
import { SALT_ROUND } from 'src/utils/jwt.consts';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { MessageService } from 'src/modules/message/message.service';
import { contractMessages } from 'src/utils/systemMessages.consts';
import { ClientService } from 'src/modules/client/client.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contracts)
    private readonly contractRepo: Repository<Contracts>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly clientService: ClientService,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<InsertResult> {
    const {
      offer: {
        freelancer: { id: freelancerId },
        jobPost: { user },
      },
    } = createContractDto;

    await this.clientService.hireFreelancer(user.id, freelancerId);

    return await this.contractRepo
      .createQueryBuilder('contracts')
      .insert()
      .into(Contracts)
      .values([createContractDto])
      .execute();
  }

  async findAll(): Promise<Contracts[]> {
    return await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .getMany();
  }

  async findOwnAsClient(userId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .where(`user.id = ${userId}`)
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOwnAsFreelancer(freelancerId: number): Promise<Contracts[]> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.chatRoom', 'chatRoom')
      .leftJoinAndSelect('chatRoom.freelancer', 'chatRoomFreelancer')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoin('offer.freelancer', 'freelancer')
      .where(`freelancer.userId = ${freelancerId}`)
      .andWhere(`chatRoomFreelancer.userId = ${freelancerId}`)
      .getMany();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async findOne(id: number): Promise<Contracts> {
    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoinAndSelect('offer.freelancer', 'freelancer')
      .where(`contracts.id = ${id}`)
      .getOne();

    if (!contract) throw new NotFoundException();

    return contract;
  }

  async update(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<void> {
    const contract = await this.findOne(id);

    const { isContractStart, isContractEnd } = updateContractDto;

    if (isContractStart) contract.startDate = new Date();
    if (isContractEnd) contract.endDate = new Date();

    await this.contractRepo
      .createQueryBuilder('contracts')
      .update(Contracts)
      .set({
        startDate: contract.startDate,
        endDate: contract.endDate,
      })
      .where('id = :id', { id: id })
      .execute();

    if (isContractEnd) {
      const contract = await this.contractRepo
        .createQueryBuilder('contracts')
        .leftJoinAndSelect('contracts.offer', 'offer')
        .leftJoinAndSelect('offer.freelancer', 'offer_freelancer')
        .leftJoinAndSelect('offer.jobPost', 'jobPost')
        .leftJoinAndSelect('jobPost.chatRoom', 'chatRoom')
        .leftJoinAndSelect('jobPost.user', 'user')
        .leftJoinAndSelect('chatRoom.freelancer', 'freelancer')
        .where({ id: id })
        .getOne();

      const chatRoom = contract.offer.jobPost.chatRoom.find(
        (chatRoom: ChatRoom) => {
          return chatRoom.freelancer.id === contract.offer.freelancer.id;
        },
      );
      const chatDeleteDate = new Date(
        contract.endDate.setMonth(contract.endDate.getMonth() + 6),
      );
      const salt = await genSalt(SALT_ROUND);
      const prolongLink = await hash('prolong' + chatRoom.id, salt);

      await this.chatRoomRepo
        .createQueryBuilder('chatRoom')
        .update(ChatRoom)
        .set({
          deleteDate: chatDeleteDate,
          prolongLink,
        })
        .where('id = :id', { id: chatRoom.id })
        .execute();

      await this.notificationsService.createOfferNotification(
        contract.offer.id,
        contract.offer.jobPost.user.id,
        contractMessages.closeByFreelancer,
      );

      await this.messageService.createSystemMessage(
        {
          chatRoomId: chatRoom.id,
          userId: contract.offer.jobPost.user.id,
          text: contractMessages.closeByFreelancer,
        },
        true,
        true,
      );

      await this.messageService.createSystemMessage(
        {
          chatRoomId: chatRoom.id,
          userId: contract.offer.freelancer.userId,
          text: contractMessages.closeByFreelancer,
        },
        true,
        true,
      );
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.contractRepo
      .createQueryBuilder('contracts')
      .delete()
      .from(Contracts)
      .where('id = :id', { id: id })
      .execute();
  }
}
