import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import {
  Proposal,
  ProposalType,
} from 'src/modules/proposal/entities/proposal.entity';
@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
  ) {}

  async create(
    createProposalDto: CreateProposalDto,
    type: ProposalType,
  ): Promise<InsertResult> {
    const { idJobPost, idFreelancer } = createProposalDto;

    return await this.proposalRepo
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
  }
}
