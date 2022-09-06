import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Users } from 'src/modules/entities/users.entity';

export enum DurationType {
  WEEK = 'week',
  MONTH = 'month',
}
export enum EnglishLevel {
  PRE_INTERMEDIATE = 'Pre-intermediate',
  INTERMEDIATE = 'Intermediate',
  UPPER_INTERMEDIATE = 'Upper-intermediate',
}

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  // add questions and attachments

  @Column()
  coverLetter: string;

  @Column()
  rate: number;

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, { cascade: true })
  @JoinColumn()
  freelancer: Freelancer;
}
