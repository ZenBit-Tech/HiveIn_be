import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { ContractsController } from 'src/modules/contracts/contracts.controller';
import { ContractsService } from 'src/modules/contracts/contracts.service';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';
import { MessageModule } from 'src/modules/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobPost, Freelancer, Contracts, ChatRoom]),
    forwardRef(() => NotificationsModule),
    forwardRef(() => MessageModule),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
