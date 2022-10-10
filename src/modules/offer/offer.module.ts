import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from 'src/modules/offer/offer.controller';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { Users } from 'src/modules/entities/users.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Message } from '../message/entities/message.entity';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { Education } from '../freelancer/entities/education.entity';
import { Experience } from '../freelancer/entities/experience.entity';
import { JobPost } from '../job-post/entities/job-post.entity';
import { LocalFile } from '../entities/localFile.entity';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessageModule } from '../message/message.module';
import { FreelancerModule } from '../freelancer/freelancer.module';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { JobPostModule } from '../job-post/job-post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      Users,
      Notification,
      Message,
      ChatRoom,
      Freelancer,
      Education,
      Experience,
      JobPost,
      LocalFile,
    ]),
    ContractsModule,
    WebsocketModule,
    NotificationsModule,
    MessageModule,
    FreelancerModule,
    ChatRoomModule,
    JobPostModule,
  ],
  providers: [OfferService],
  controllers: [OfferController],
})
export class OfferModule {}
