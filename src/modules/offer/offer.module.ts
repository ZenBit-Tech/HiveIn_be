import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferService } from 'src/modules/offer/offer.service';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { OfferController } from 'src/modules/offer/offer.controller';
import { ContractsModule } from 'src/modules/contracts/contracts.module';
import { Users } from 'src/modules/entities/users.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Education } from 'src/modules/freelancer/entities/education.entity';
import { Experience } from 'src/modules/freelancer/entities/experience.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { MessageModule } from 'src/modules/message/message.module';
import { FreelancerModule } from 'src/modules/freelancer/freelancer.module';
import { ChatRoomModule } from 'src/modules/chat-room/chat-room.module';
import { JobPostModule } from 'src/modules/job-post/job-post.module';

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
