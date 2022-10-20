import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { CreateOfferDto } from 'src/modules/offer/dto/create-offer.dto';
import { UpdateOfferDto } from 'src/modules/offer/dto/update-offer.dto';
import { Status } from 'src/modules/offer/typesDef';
import { ContractsService } from 'src/modules/contracts/contracts.service';
import { UserRole, Users } from 'src/modules/entities/users.entity';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { MessageService } from 'src/modules/message/message.service';
import { JobPostService } from 'src/modules/job-post/job-post.service';
import { constSystemMessages } from 'src/utils/systemMessages';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly contractsService: ContractsService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly freelancerService: FreelancerService,
    private readonly messageService: MessageService,
    private readonly jobPostService: JobPostService,
    @Inject(forwardRef(() => ChatRoomService))
    private chatRoomService: ChatRoomService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    userWhoMakesOffer: number,
  ): Promise<Offer> {
    try {
      const isOfferAlreadyExist = await this.getOneByFreelancerIdAndJobPostId(
        createOfferDto.freelancerId,
        createOfferDto.jobPostId,
      );

      if (isOfferAlreadyExist)
        throw new HttpException(
          'Offer to this user related to this job post already exist',
          406,
        );

      const offer = await this.offerRepository.save({
        status: Status.PENDING,
        freelancer: { id: createOfferDto.freelancerId },
        jobPost: { id: createOfferDto.jobPostId },
      });

      const freelancerUserId =
        await this.freelancerService.getUserIdByFreelancerId(
          createOfferDto.freelancerId,
        );

      const chatRoomId =
        await this.chatRoomService.getRoomIdByJobPostAndFreelancerIds(
          createOfferDto.jobPostId,
          createOfferDto.freelancerId,
        );

      if (!chatRoomId || !freelancerUserId) throw new NotFoundException();

      await this.messageService.createSystemOfferMessage({
        chatRoomId: chatRoomId,
        userId: freelancerUserId,
        text: constSystemMessages.newOfferMessage,
      });

      await this.messageService.createSystemMessage({
        chatRoomId: chatRoomId,
        userId: userWhoMakesOffer,
        text: constSystemMessages.newOfferSend,
      });

      await this.notificationsService.createOfferNotification(
        offer.id,
        freelancerUserId,
        this.generateTextForNotification(Status.PENDING),
      );

      return offer;
    } catch (error) {
      Logger.error('Error occurred while trying to create offer');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    try {
      if (updateOfferDto.status === Status.PENDING)
        throw new HttpException(
          'Offer should not be updated to pending status!',
          HttpStatus.BAD_REQUEST,
        );
      const currentOffer = await this.offerRepository.findOneBy({ id });

      if (!currentOffer) throw new NotFoundException();

      const offer = await this.offerRepository.save({
        ...currentOffer,
        status: updateOfferDto.status,
      });

      if (offer.status === Status.ACCEPTED)
        await this.contractsService.create({
          offer,
          startDate: new Date(),
          endDate: null,
        });
      await this.notificationsService.createOfferNotification(
        offer.id,
        await this.jobPostService.getOwnerIdByPostId(offer.jobPost.id),
        this.generateTextForNotification(offer.status),
      );
      return offer;
    } catch (error) {
      Logger.error('Error occurred while trying to update offer');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  private generateTextForNotification(status: Status): string {
    switch (status) {
      case Status.PENDING:
        return 'You have receive a new offer';
      case Status.ACCEPTED:
        return 'Your offer have been accepted';
      case Status.REJECTED:
        return 'Your offer have been rejected';
      case Status.EXPIRED:
        return 'Your offer expired';
      default:
        throw new HttpException('Incorrect offer type', 400);
    }
  }

  async getAllOwn(userId: number): Promise<Offer[]> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });

      if (user.role === UserRole.UNDEFINED) throw new ForbiddenException();

      if (user.role === UserRole.FREELANCER)
        return await this.getAllOwnAsFreelancer(userId);

      if (user.role === UserRole.CLIENT)
        return await this.getAllOwnAsClient(userId);
    } catch (error) {
      Logger.error('Error occurred while trying to get all own user offers');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  private async getAllOwnAsFreelancer(userId: number): Promise<Offer[]> {
    try {
      return await this.offerRepository
        .createQueryBuilder('offer')
        .leftJoin('offer.freelancer', 'freelancer')
        .leftJoin('freelancer.user', 'user')
        .leftJoinAndSelect('offer.jobPost', 'jobPost')
        .leftJoinAndSelect('jobPost.skills', 'skills')
        .leftJoinAndSelect(
          'jobPost.category',
          'category',
          'jobPost.categoryId = category.id',
        )
        .leftJoinAndSelect('jobPost.user', 'users')
        .leftJoinAndSelect('users.avatar', 'avatar')
        .where(`user.id = ${userId}`)
        .orderBy('offer.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      Logger.error('Error occurred while trying to get all freelancer offers');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  private async getAllOwnAsClient(userId: number): Promise<Offer[]> {
    try {
      return await this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.freelancer', 'freelancer')
        .leftJoinAndSelect('freelancer.user', 'user')
        .leftJoinAndSelect('offer.jobPost', 'jobPost')
        .leftJoin('jobPost.user', 'client')
        .where(`client.id = ${userId}`)
        .getMany();
    } catch (error) {
      Logger.error('Error occurred while trying to get all client offers');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  async getOneById(id: number): Promise<Offer> {
    try {
      return await this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.freelancer', 'freelancer')
        .leftJoinAndSelect('freelancer.user', 'userFreelancer')
        .leftJoinAndSelect('offer.jobPost', 'jobPost')
        .leftJoinAndSelect('jobPost.user', 'userClient')
        .where(`offer.id = ${id}`)
        .getOne();
    } catch (error) {
      Logger.error('Error occurred while trying to get one offer');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  async getOneByFreelancerIdAndJobPostId(
    freelancerId: number,
    jobPostId: number,
  ): Promise<Offer> {
    try {
      return await this.offerRepository
        .createQueryBuilder('offer')
        .leftJoinAndSelect('offer.freelancer', 'freelancer')
        .leftJoinAndSelect('freelancer.user', 'userFreelancer')
        .leftJoinAndSelect('offer.jobPost', 'jobPost')
        .leftJoinAndSelect('jobPost.user', 'userClient')
        .where('jobPost.id = :jobPostId', { jobPostId })
        .andWhere('freelancer.id = :freelancerId', { freelancerId })
        .getOne();
    } catch (error) {
      Logger.error('Error occurred while trying to get one offer');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }
}
