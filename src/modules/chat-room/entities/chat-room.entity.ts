import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobPost)
  @JoinColumn({ name: 'jobPostId' })
  jobPost: JobPost;

  @ManyToOne(() => Freelancer)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @OneToMany(() => Message, (message) => message.chatRoom)
  message: Message[];

  @Column({
    type: 'enum',
    enum: chatRoomStatus,
  })
  status: chatRoomStatus;
}
