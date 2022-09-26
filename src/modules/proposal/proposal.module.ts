import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { Education } from 'src/modules/freelancer/entities/education.entity';
import { Experience } from 'src/modules/freelancer/entities/experience.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { FreelancerService } from 'src/modules/freelancer/freelancer.service';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { ProposalController } from 'src/modules/proposal/proposal.controller';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { ChatRoomService } from 'src/modules/chat-room/chat-room.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';
import { Message } from 'src/modules/message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposal,
      Users,
      Freelancer,
      JobPost,
      Experience,
      Education,
      ChatRoomService,
      SettingsInfoService,
      ChatRoom,
      Message,
    ]),
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    FreelancerService,
    ChatRoomService,
    SettingsInfoService,
  ],
})
export class ProposalModule {}
