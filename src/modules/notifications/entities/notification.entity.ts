import { Users } from 'src/modules/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Message } from 'src/modules/message/entities/message.entity';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  MESSAGE = 'message',
  OFFER = 'offer',
  PROPOSAL = 'proposal',
}

@Entity()
export class Notification {
  @ApiProperty({
    description: 'Id of notification',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Is anyone read notification',
    example: true,
    default: false,
  })
  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description: 'Type of notification',
    example: NotificationType.MESSAGE,
    type: NotificationType,
  })
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Text of notification',
    example: 'Lorem Ipsum',
  })
  @Column()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'User that connect with this notification',
    type: Users,
  })
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ApiProperty({
    description: 'Message that connect with this notification',
    type: Message,
  })
  @ManyToOne(() => Message, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @ApiProperty({
    description: 'Offer that connect with this notification',
    type: Offer,
  })
  @ManyToOne(() => Offer, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @ApiProperty({
    description: 'Proposal that connect with this notification',
    type: Proposal,
  })
  @ManyToOne(() => Proposal, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proposalId' })
  proposal: Proposal;

  @ApiProperty({
    description: 'Date when notification was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;
}
