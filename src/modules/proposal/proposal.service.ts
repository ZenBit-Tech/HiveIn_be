import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { chatRoomStatus } from '../chat-room/entities/chat-room.entity';
import { Message } from '../message/entities/message';
import { SettingsInfoService } from '../settings-info/settings-info.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly freelancerService: FreelancerService,
    private readonly chatRoomService: ChatRoomService,
    private readonly settingsInfoService: SettingsInfoService,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
  ): Promise<InsertResult> {
    const { idJobPost } = createProposalDto;
    const freelancer = await this.freelancerService.findOneByUserId(userId);
    const user = await this.settingsInfoService.findOne(userId);

    const chatRoom = await this.chatRoomService.create({
      jobPostId: idJobPost,
      freelancerId: freelancer.id,
      status: chatRoomStatus.CLIENT_ONLY,
    });

    const values = [
      {
        chatRoom,
        user,
        text: createProposalDto.coverLetter,
      },
      {
        chatRoom,
        user,
        text: `bid: ${createProposalDto.bid}`,
      },
    ];

    await this.messageRepo
      .createQueryBuilder('message')
      .insert()
      .into(Message)
      .values(values)
      .execute();

    return await this.proposalRepo
      .createQueryBuilder('proposal')
      .insert()
      .into(Proposal)
      .values([
        {
          ...createProposalDto,
          jobPost: { id: idJobPost },
          freelancer: freelancer,
        },
      ])
      .execute();
  }
}
