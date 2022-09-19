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

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => ChatRoom)
  @JoinColumn()
  room: ChatRoom;

  @CreateDateColumn()
  created_at: Date;
}
