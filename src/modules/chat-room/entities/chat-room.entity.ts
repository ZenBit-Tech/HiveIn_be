import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from '../../job-post/entities/job-post.entity';
import { Freelancer } from '../../freelancer/entities/freelancer.entity';
import { Message } from '../../message/entities/message';

export enum chatRoomStatus {
  FOR_ALL = 'forAll',
  FREELANCER_ONLY = 'freelancerOnly',
  CLIENT_ONLY = 'clientOnly',
}

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
