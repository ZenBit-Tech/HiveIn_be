import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Users } from 'src/modules/entities/users.entity';
import { LocalFile } from 'src/modules/entities/localFile.entity';
import { Offer } from 'src/modules/offer/entities/offer.entity';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import { ChatRoom } from 'src/modules/chat-room/entities/chat-room.entity';

export enum DurationType {
  WEEK = 'week',
  MONTH = 'month',
}

export enum EnglishLevel {
  PRE_INTERMEDIATE = 'pre-intermediate',
  INTERMEDIATE = 'intermediate',
  UPPER_INTERMEDIATE = 'upper-intermediate',
}

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 0 })
  duration: number;

  @Column({
    type: 'enum',
    enum: DurationType,
    default: DurationType.WEEK,
  })
  durationType: DurationType;

  @ManyToOne(() => Category, (category) => category.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: Users;

  @OneToMany(() => Proposal, (proposal) => proposal.jobPost)
  @JoinColumn()
  proposal: Proposal;

  @OneToMany(() => Offer, (offer) => offer.jobPost)
  @JoinColumn()
  offer: Offer;

  @JoinColumn({ name: 'fileId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  file?: LocalFile;

  @Column({ nullable: true })
  fileId: number | null;

  @Column({ nullable: true })
  rate: number;

  @ManyToMany(() => Skill, (skills) => skills.jobPosts, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  skills: Skill[];

  @Column()
  isDraft: boolean;

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'text', nullable: true })
  jobDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.jobPost)
  chatRoom: ChatRoom[];
}
