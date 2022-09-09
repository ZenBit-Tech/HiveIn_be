import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, Freelancer, Contracts])],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
