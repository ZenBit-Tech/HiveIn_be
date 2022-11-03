import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import {
  HttpException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import {
  Proposal,
  ProposalType,
} from 'src/modules/proposal/entities/proposal.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { MessageService } from 'src/modules/message/message.service';
import { JobPostService } from 'src/modules/job-post/job-post.service';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import {
  WebsocketService,
  Event,
} from 'src/modules/websocket/websocket.service';
import { LocalFileDto } from 'src/modules/job-post/dto/localFile.dto';
import { LocalFile } from '../entities/localFile.entity';
import { LocalFilesService } from '../job-post/localFiles.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly chatRoomService: ChatRoomService,
    private readonly freelancerService: FreelancerService,
    private readonly messageService: MessageService,
    private readonly jobPostService: JobPostService,
    private readonly notificationsService: NotificationsService,
    private readonly wsService: WebsocketService,
    private localFilesService: LocalFilesService,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
    type: ProposalType,
    fileData: LocalFileDto | null,
  ): Promise<Proposal> {
    try {
      let file: LocalFile | null = null;
      const { idJobPost, idFreelancer } = createProposalDto;

      if (fileData) {
        file = await this.localFilesService.saveLocalFileData(fileData);
      }

      const isChatAlreadyExist = await this.getOneByJobPostAndFreelancerId(
        idFreelancer,
        idJobPost,
      );

      if (isChatAlreadyExist)
        throw new HttpException(
          "This user can't send invite/proposal. Chat room for this users related to this job post already exist",
          406,
        );

      const proposal = await this.proposalRepo.save({
        ...createProposalDto,
        type,
        jobPost: { id: idJobPost },
        freelancer: { id: idFreelancer },
        file,
      });

      const chatRoom = await this.chatRoomService.create({
        jobPostId: idJobPost,
        freelancerId: idFreelancer,
        status:
          type === ProposalType.PROPOSAL
            ? chatRoomStatus.CLIENT_ONLY
            : chatRoomStatus.FREELANCER_ONLY,
      });

      const usersIds = await this.defineUsersIds(idFreelancer, idJobPost, type);

      await this.messageService.createInitialMessages(
        chatRoom.id,
        usersIds.inviteFrom,
        usersIds.inviteTo,
        type,
        createProposalDto.message,
        createProposalDto.bid,
      );

      await this.notificationsService.createNewProposalNotification(
        proposal.id,
        usersIds.inviteTo,
        type,
      );

      await this.wsService.triggerEventByUserId(userId, Event.GET_ROOMS);

      return proposal;
    } catch (error) {
      Logger.error('Error occurred while sending proposal');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  async getOneByJobPostAndFreelancerId(
    freelancerId,
    jobPostId,
  ): Promise<Proposal> {
    try {
      return await this.proposalRepo
        .createQueryBuilder('proposal')
        .leftJoinAndSelect('proposal.freelancer', 'freelancer')
        .leftJoinAndSelect('proposal.jobPost', 'jobPost')
        .where('jobPost.id = :jobPostId', { jobPostId })
        .andWhere('freelancer.id = :freelancerId', { freelancerId })
        .getOne();
    } catch (error) {
      Logger.error('Error occurred while trying to get proposal from db');
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  private async defineUsersIds(
    freelancerId: number,
    jobPostId: number,
    type: ProposalType,
  ): Promise<{ inviteFrom: number; inviteTo: number }> {
    try {
      if (type === ProposalType.INVITE) {
        return {
          inviteTo: await this.freelancerService.getUserIdByFreelancerId(
            freelancerId,
          ),
          inviteFrom: await this.jobPostService.getOwnerIdByPostId(jobPostId),
        };
      }

      return {
        inviteTo: await this.jobPostService.getOwnerIdByPostId(jobPostId),
        inviteFrom: await this.freelancerService.getUserIdByFreelancerId(
          freelancerId,
        ),
      };
    } catch (error) {
      Logger.error(
        'Error occurred while trying to define users ids in proposal service',
      );
      if (error instanceof HttpException)
        throw new HttpException(error.message, error.getStatus());
      throw new UnprocessableEntityException();
    }
  }

  async getProposalByJobId(userId: number, jobPostId: string) {
    try {
      const proposals = await this.proposalRepo
        .createQueryBuilder('proposal')
        .leftJoinAndSelect('proposal.jobPost', 'jobPost')
        .leftJoinAndSelect('proposal.freelancer', 'freelancer')
        .leftJoinAndSelect('freelancer.user', 'user')
        .where({
          freelancer: { user: { id: userId } },
          jobPost: { id: jobPostId },
        })
        .getMany();

      return proposals;
    } catch (error) {
      return error;
    }
  }
}
