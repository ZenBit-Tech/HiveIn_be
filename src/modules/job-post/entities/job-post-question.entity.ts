import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from './job-post.entity';
import { FreelancerAnswer } from './freelancer-answer.entity';

@Entity()
export class JobPostQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.questions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  jobPost: JobPost;

  @OneToMany(() => FreelancerAnswer, (answer) => answer.question, {
    nullable: true,
  })
  answers: FreelancerAnswer[];
}
