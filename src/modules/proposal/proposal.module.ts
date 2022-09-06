import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Proposal } from './entities/proposal.entity';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, Users, Freelancer])],
  controllers: [ProposalController],
  providers: [ProposalService],
})
export class ProposalModule {}
