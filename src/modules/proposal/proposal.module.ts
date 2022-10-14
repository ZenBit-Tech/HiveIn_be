import { ClientService } from 'src/modules/client/client.service';
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
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { LocalFilesService } from 'src/modules/job-post/localFiles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proposal,
      Users,
      Freelancer,
      JobPost,
      Experience,
      Education,
      ChatRoom,
      Message,
      LocalFile,
    ]),
  ],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    FreelancerService,
    ChatRoomService,
    SettingsInfoService,
    ClientService,
    LocalFilesService,
  ],
})
export class ProposalModule {}
