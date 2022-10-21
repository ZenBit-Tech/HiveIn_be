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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ChatRoom {
  @ApiProperty({
    description: 'Id of the chat room',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Job post',
    type: JobPost,
  })
  @ManyToOne(() => JobPost)
  @JoinColumn({ name: 'jobPostId' })
  jobPost: JobPost;

  @ApiProperty({
    description: 'Freelancer',
    type: Freelancer,
  })
  @ManyToOne(() => Freelancer)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @ApiProperty({
    description: 'Message',
    type: [Message],
  })
  @OneToMany(() => Message, (message) => message.chatRoom)
  message: Message[];

  @ApiProperty({
    description: 'Status of chat room',
    enum: chatRoomStatus,
    example: chatRoomStatus.FOR_ALL,
  })
  @Column({
    type: 'enum',
    enum: chatRoomStatus,
  })
  status: chatRoomStatus;

  @ApiProperty({
    description: 'Update date of chat room',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
