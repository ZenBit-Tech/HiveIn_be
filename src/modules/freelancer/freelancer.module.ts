import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from 'src/modules/client/client.service';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { FreelancerController } from 'src/modules/freelancer/freelancer.controller';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Experience } from 'src/modules/freelancer/entities/experience.entity';
import { Education } from 'src/modules/freelancer/entities/education.entity';
import { Users } from 'src/modules/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Freelancer, Experience, Education, Users]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService, ClientService],
  exports: [FreelancerService],
})
export class FreelancerModule {}
