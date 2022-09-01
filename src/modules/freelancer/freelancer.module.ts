import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './entities/freelancer.entity';
import { Experience } from './entities/experience.entity';
import { Education } from './entities/education.entity';
import { Users } from '../entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Freelancer, Experience, Education, Users]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService],
})
export class FreelancerModule {}
