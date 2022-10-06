import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
    type: ProposalType,
  ): Promise<InsertResult> {
    const { idJobPost, idFreelancer } = createProposalDto;

    const proposal = await this.proposalRepo
      .createQueryBuilder('proposal')
      .insert()
      .into(Proposal)
      .values([
        {
          ...createProposalDto,
          type,
          jobPost: { id: idJobPost },
          freelancer: { id: idFreelancer },
        },
      ])
      .execute();

    const chatRoom = await this.chatRoomService.create({
      jobPostId: idJobPost,
      freelancerId: idFreelancer,
      status:
        type === ProposalType.PROPOSAL
          ? chatRoomStatus.CLIENT_ONLY
          : chatRoomStatus.FREELANCER_ONLY,
    });

    // const id = this.defineInvitedUserId(userId, type);
    //
    // const messages = this.messageService.createInitialMessages(
    //   chatRoom,
    //   idFreelancer,
    // );

    return proposal;
  }

  // private async defineInvitedUserId(
  //   currentUserId: number,
  //   freelancerId: number,
  //   jobPostId: number,
  //   type: ProposalType,
  // ) {
  //   if (type === ProposalType.INVITE) return freelancerId;
  //
  //   return await this.jobPostService.getUserIdByRoomId(id);
  // }
}
