import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from 'src/modules/proposal/dto/create-proposal.dto';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    private readonly freelancerService: FreelancerService,
  ) {}

  async create(createProposalDto: CreateProposalDto, userId: number) {
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
}
