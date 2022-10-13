import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
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
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    type: ProposalType,
  ): Promise<Proposal> {
    try {
      const { idJobPost, idFreelancer } = createProposalDto;

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

      return proposal;
    } catch (e) {
      Logger.error('Error occurred while sending proposal');
      if (e instanceof UnauthorizedException)
        return Promise.reject(new UnprocessableEntityException());
    }
  }

  async getOneByJobPostAndFreelancerId(
    freelancerId,
    jobPostId,
  ): Promise<Proposal> {
    return await this.proposalRepo
      .createQueryBuilder('proposal')
      .leftJoinAndSelect('proposal.freelancer', 'freelancer')
      .leftJoinAndSelect('proposal.jobPost', 'jobPost')
      .where('jobPost.id = :jobPostId', { jobPostId })
      .andWhere('freelancer.id = :freelancerId', { freelancerId })
      .getOne();
  }

  private async defineUsersIds(
    freelancerId: number,
    jobPostId: number,
    type: ProposalType,
  ): Promise<{ inviteFrom: number; inviteTo: number }> {
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
  }
}
