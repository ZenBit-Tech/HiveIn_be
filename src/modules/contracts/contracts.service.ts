import { CHAT } from './../../utils/auth.consts';
import { MailerService } from '@nestjs-modules/mailer';
import { TasksService } from 'src/modules/task.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contracts)
    private readonly contractRepo: Repository<Contracts>,
    private readonly tasksService: TasksService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<InsertResult> {
    console.warn('contract start create');
    const result = await this.contractRepo
      .createQueryBuilder('contracts')
      .insert()
      .into(Contracts)
      .values([createContractDto])
      .execute();

    const contract = await this.contractRepo
      .createQueryBuilder('contracts')
      .leftJoinAndSelect('contracts.offer', 'offer')
      .leftJoinAndSelect('offer.jobPost', 'jobPost')
      .leftJoinAndSelect('jobPost.user', 'user')
      .leftJoinAndSelect('jobPost.chatRoom', 'chatRoom')
      .where({ id: result.raw.insertId })
      .getOne();
    console.log(contract);
    console.log(contract.offer.jobPost.chatRoom);
    const chatRoom = contract.offer.jobPost.chatRoom[0]; // it should be one chatRoom to one job

    const timeDifference = this.getSecondsDiff(new Date(), contract.endDate);
    console.log(timeDifference);

    this.tasksService.addNewTimeout(
      'task ' + timeDifference,
      timeDifference * 1000,
      async () => {
        const { email } = contract.offer.jobPost.user;

        const chatUrl =
          this.configService.get<string>('FRONTEND_SIGN_IN_REDIRECT_URL') +
          CHAT +
          '/' +
          chatRoom.id;

        const deleteChatUrl = '';
        const prolongChatUrl = '';

        await this.mailService.sendMail({
          to: email,
          subject: 'GetJob Delete Chat',
          from: 'milkav06062003@gmail.com',
          html: `<h1>Hello</h1><h1>Your <a href="${chatUrl}">chat</a> will be automatically deleted in ${contract.endDate}</h1>
          <h2>Please select one of the following variants:</h2>
          <ul>
          <li><a href="${deleteChatUrl}">Delete chat</a></li>
          <li><a href="${prolongChatUrl}">Prolong chat chat</a></li
          </ul>`,
        });
      },
    );

    return result;
  }

  getSecondsDiff = (startDate, endDate) => {
    const msInSecond = 1000;

    return Math.round(
      Math.abs(endDate.getTime() - startDate.getTime()) / msInSecond,
    );
  };

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
      .leftJoinAndSelect('jobPost.category', 'category')
      .leftJoinAndSelect('jobPost.skills', 'skills')
      .leftJoin('offer.freelancer', 'freelancer')
      .where(`freelancer.userId = ${freelancerId}`)
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
