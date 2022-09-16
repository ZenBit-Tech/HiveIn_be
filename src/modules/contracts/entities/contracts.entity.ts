import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Contracts {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => JobPost, (jobPost) => jobPost.contract)
  jobPost: JobPost;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, {
    cascade: true,
    nullable: true,
  })
  freelancer: Freelancer;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
