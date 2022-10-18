import { RecentlyViewedFreelancers } from 'src/modules/client/entities/recently-viewed-freelancers.entity';
import { ClientService } from 'src/modules/client/client.service';
import { Module } from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import { FreelancerController } from './freelancer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './entities/freelancer.entity';
import { Experience } from './entities/experience.entity';
import { Education } from './entities/education.entity';
import { Users } from 'src/modules/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Freelancer,
      Experience,
      Education,
      Users,
      RecentlyViewedFreelancers,
    ]),
  ],
  controllers: [FreelancerController],
  providers: [FreelancerService, ClientService],
})
export class FreelancerModule {}
