import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inviteMessage: string;

  @Column()
  bid: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.id, { cascade: true })
  @JoinColumn()
  jobPost: JobPost;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, { cascade: true })
  @JoinColumn()
  freelancer: Freelancer;
}
