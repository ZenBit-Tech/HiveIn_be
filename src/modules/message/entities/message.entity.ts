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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Message {
  @ApiProperty({
    description: 'Id of message',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Text of message',
    example: 'Lorem Ipsum',
  })
  @Column()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'User who sent message',
    type: () => Users,
  })
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'senderId' })
  user: Users;

  @ApiProperty({
    description: 'Chat room of message',
    type: () => ChatRoom,
  })
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.message, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoom;

  @ApiProperty({
    description: 'Type of message',
    example: MessageType.FROM_SYSTEM,
    enum: MessageType,
  })
  @Column({
    type: 'enum',
    enum: MessageType,
  })
  messageType: MessageType;
  @ApiProperty({
    description: 'Date when message was created',
    type: Date,
  })
  @CreateDateColumn()
  created_at: Date;
}
