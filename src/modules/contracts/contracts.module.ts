import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { ContractsController } from 'src/modules/contracts/contracts.controller';
import { ContractsService } from 'src/modules/contracts/contracts.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, Freelancer, Contracts])],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
