import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { Invite } from 'src/modules/proposal/entities/invite.entity';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly freelancerService: FreelancerService,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    userId: number,
  ): Promise<InsertResult> {
    const { idJobPost } = createProposalDto;
    const freelancer = await this.freelancerService.findOneByUserId(userId);

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

  async createInvite({
    idFreelancer,
    idJobPost,
    inviteMessage,
    bid,
  }: CreateInviteDto): Promise<InsertResult> {
    return await this.inviteRepo
      .createQueryBuilder('invite')
      .insert()
      .into(Invite)
      .values([
        {
          bid,
          jobPost: { id: idJobPost },
          freelancer: { id: idFreelancer },
          inviteMessage,
        },
      ])
      .execute();
  }
}
