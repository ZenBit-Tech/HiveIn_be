import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { chatRoomStatus } from 'src/modules/chat-room/typesDef';
import { IsString } from 'class-validator';

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

  @OneToMany(() => Message, (message) => message.chatRoom, {
    cascade: true,
  })
  message: Message[];

  @Column({
    type: 'enum',
    enum: chatRoomStatus,
  })
  status: chatRoomStatus;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  @IsString()
  prolongLink: string;

  @Column({ nullable: true })
  deleteDate: Date;
}
