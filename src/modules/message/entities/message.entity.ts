import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { IsBoolean } from 'class-validator';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'senderId' })
  user: Users;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.message)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  @IsBoolean()
  isSystemMessage: boolean;
}
