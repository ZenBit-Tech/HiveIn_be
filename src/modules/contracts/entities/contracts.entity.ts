import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ContractStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

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

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  contractStatus: ContractStatus;

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
