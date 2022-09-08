import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Proposal } from './entities/proposal.entity';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, Users, Freelancer, JobPost])],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
