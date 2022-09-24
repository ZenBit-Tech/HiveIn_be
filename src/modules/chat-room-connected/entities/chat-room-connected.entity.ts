import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../entities/users.entity';
import { ChatRoom } from '../../chat-room/entities/chat-room.entity';

@Entity()
export class ChatRoomConnected {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => ChatRoom)
  @JoinColumn()
  room: ChatRoom;
}
