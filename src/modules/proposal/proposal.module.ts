import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { Education } from 'src/modules/freelancer/entities/education.entity';
import { Experience } from 'src/modules/freelancer/entities/experience.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { ProposalController } from 'src/modules/proposal/proposal.controller';
import { ProposalService } from 'src/modules/proposal/proposal.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { FreelancerModule } from 'src/modules/freelancer/freelancer.module';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { SettingsInfoModule } from 'src/modules/settings-info/settings-info.module';
import { MessageModule } from 'src/modules/message/message.module';
import { JobPostModule } from 'src/modules/job-post/job-post.module';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { WebsocketModule } from 'src/modules/websocket/websocket.module';
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
      Notification,
    ]),
    FreelancerModule,
    ChatRoomModule,
    SettingsInfoModule,
    MessageModule,
    JobPostModule,
    NotificationsModule,
    WebsocketModule,
  ],
  controllers: [ProposalController],
  providers: [ProposalService, LocalFilesService],
})
export class ProposalModule {}
