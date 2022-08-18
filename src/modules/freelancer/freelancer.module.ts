import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './entities/freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer])],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class FreelancerModule {}
