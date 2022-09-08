import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Proposal } from './entities/proposal.entity';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepo: Repository<Proposal>,
    @InjectRepository(Freelancer)
    private readonly freelancersRepo: Repository<Freelancer>,
    @InjectRepository(JobPost)
    private readonly jobPostRepo: Repository<JobPost>,
  ) {}

  async create(
    { coverLetter, rate, idJobPost }: CreateProposalDto,
    freelancerUserId: number,
  ) {
    const freelancer = await this.freelancersRepo
      .createQueryBuilder('freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .where({
        user: {
          id: freelancerUserId,
        },
      })
      .getOne();

    const jobPost = await this.jobPostRepo.findOne({
      where: {
        id: idJobPost,
      },
    });

    return await this.proposalRepo.save({
      coverLetter,
      rate,
      jobPost,
      freelancer,
    });
  }
}
