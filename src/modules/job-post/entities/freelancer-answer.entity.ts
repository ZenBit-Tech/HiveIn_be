import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPostQuestion } from './job-post-question.entity';
import { Freelancer } from '../../freelancer/entities/freelancer.entity';

@Entity()
export class FreelancerAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer: string;

  @ManyToOne(() => Freelancer)
  freelancer: Freelancer;

  @ManyToOne(() => JobPostQuestion, (question) => question.answers)
  @JoinTable()
  question: JobPostQuestion;
}
