import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import {
  Proposal,
  ProposalType,
} from 'src/modules/proposal/entities/proposal.entity';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { MessageService } from '../message/message.service';
import { JobPostService } from '../job-post/job-post.service';
import { LocalFile } from '../entities/localFile.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly chatRoomService: ChatRoomService,
    private readonly freelancerService: FreelancerService,
    private readonly settingsInfoService: SettingsInfoService,
    private readonly messageService: MessageService,
    private readonly jobPostService: JobPostService,
    @InjectRepository(LocalFile)
    private readonly local: Repository<LocalFile>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
    type: ProposalType,
  ): Promise<Proposal> {
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
  }

  async getOneByJobPostAndFreelancerId(freelancerId, jobPostId) {
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
