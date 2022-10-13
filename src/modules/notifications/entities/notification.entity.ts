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

export enum NotificationType {
  MESSAGE = 'message',
  OFFER = 'offer',
  PROPOSAL = 'proposal',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @Column()
  @IsString()
  text: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @ManyToOne(() => Offer, { nullable: true })
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @ManyToOne(() => Proposal, { nullable: true })
  @JoinColumn({ name: 'proposalId' })
  proposal: Proposal;

  @CreateDateColumn()
  createdAt: Date;
}
