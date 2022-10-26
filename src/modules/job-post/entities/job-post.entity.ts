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
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: 'Id of job post',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Title of job post',
    example: 'Lorem Ipsum',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Duration of job post',
    example: 10,
    default: 0,
  })
  @Column({ default: 0 })
  duration: number;

  @ApiProperty({
    description: 'Duration type of job post',
    enum: DurationType,
    default: DurationType.WEEK,
  })
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

  @ApiProperty({
    description: 'Id of file that was attached to job post',
  })
  @Column({ nullable: true })
  fileId: number | null;

  @ApiProperty({
    description: 'Rate of job post',
    example: 30,
  })
  @Column({ nullable: true })
  rate: number;

  @ApiProperty({
    description: 'Skills that are necessary for job post',
    type: () => [Skill],
  })
  @ManyToMany(() => Skill, (skills) => skills.jobPosts, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  skills: Skill[];

  @ApiProperty({
    description: 'Is this job post are draft',
    example: true,
  })
  @Column()
  isDraft: boolean;

  @ApiProperty({
    description: 'English level of job post',
    example: EnglishLevel.INTERMEDIATE,
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  englishLevel: EnglishLevel;

  @ApiProperty({
    description: 'Description of job post',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Column({ type: 'text', nullable: true })
  jobDescription: string;

  @ApiProperty({
    description: 'Date when job post entity was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last date when job post entity was updated',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.jobPost)
  chatRoom: ChatRoom[];
}
