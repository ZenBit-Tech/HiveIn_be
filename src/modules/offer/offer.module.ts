import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from 'src/modules/offer/offer.controller';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { Users } from 'src/modules/entities/users.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Message } from '../message/entities/message.entity';
import { MessageService } from '../message/message.service';
import { FreelancerService } from '../freelancer/freelancer.service';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { ChatRoom } from '../chat-room/entities/chat-room.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { Education } from '../freelancer/entities/education.entity';
import { Experience } from '../freelancer/entities/experience.entity';
import { JobPostService } from '../job-post/job-post.service';
import { LocalFilesService } from '../job-post/localFiles.service';
import { JobPost } from '../job-post/entities/job-post.entity';
import { LocalFile } from '../entities/localFile.entity';

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
  ],
  providers: [
    OfferService,
    NotificationsService,
    MessageService,
    FreelancerService,
    ChatRoomService,
    JobPostService,
    LocalFilesService,
  ],
  controllers: [OfferController],
})
export class OfferModule {}
