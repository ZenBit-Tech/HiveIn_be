import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coverLetter: string;

  @Column()
  rate: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.id, { cascade: true })
  @JoinColumn()
  jobPost: JobPost;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, { cascade: true })
  @JoinColumn()
  freelancer: Freelancer;
}