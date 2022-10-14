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
import { Message } from 'src/modules/message/entities/message.entity';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { MessageType } from 'src/modules/message/typesDef';
import { LocalFilesService } from 'src/modules/job-post/localFiles.service';
import { LocalFileDto } from 'src/modules/proposal/dto/localFile.dto';
import { LocalFile } from 'src/modules/entities/localFile.entity';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly chatRoomService: ChatRoomService,
    private readonly freelancerService: FreelancerService,
    private readonly settingsInfoService: SettingsInfoService,
    private localFilesService: LocalFilesService,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
    type: ProposalType,
    fileData: LocalFileDto | null,
  ): Promise<InsertResult> {
    let file: LocalFile | null = null;
    const { idJobPost, idFreelancer } = createProposalDto;

    if (fileData) {
      file = await this.localFilesService.saveLocalFileData(fileData);
    }

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
          fileId: file?.id || null,
        },
      ])
      .execute();

    const user = await this.settingsInfoService.findOne(userId);
    const freelancer = await this.freelancerService.findOneByUserId(userId);

    const chatRoom = await this.chatRoomService.create({
      jobPostId: idJobPost,
      freelancerId: freelancer.id,
      status: chatRoomStatus.CLIENT_ONLY,
    });

    const values = [
      {
        chatRoom,
        user,
        text: 'You have received a new proposal!',
        messageType: MessageType.FROM_SYSTEM,
      },
      {
        chatRoom,
        user,
        text: createProposalDto.message,
        messageType: MessageType.FROM_USER,
      },
      {
        chatRoom,
        user,
        text: `bid: ${createProposalDto.bid}`,
        messageType: MessageType.FROM_USER,
      },
    ];

    await this.messageRepo
      .createQueryBuilder('message')
      .insert()
      .into(Message)
      .values(values)
      .execute();

    return proposal;
  }
}
