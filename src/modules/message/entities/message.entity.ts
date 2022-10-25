import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';
import { Users } from 'src/modules/entities/users.entity';
import { MessageType } from 'src/modules/message/typesDef';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  text: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'senderId' })
  user: Users;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.message, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  messageType: MessageType;

  @CreateDateColumn()
  created_at: Date;
}
