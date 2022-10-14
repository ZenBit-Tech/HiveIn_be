import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { LocalFile } from 'src/modules/entities/localFile.entity';

export enum ProposalType {
  PROPOSAL = 'proposal',
  INVITE = 'invite',
}

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  bid: number;

  @ManyToOne(() => JobPost, (jobPost) => jobPost.id, { cascade: true })
  @JoinColumn()
  jobPost: JobPost;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, { cascade: true })
  @JoinColumn()
  freelancer: Freelancer;

  @Column({
    type: 'enum',
    enum: ProposalType,
  })
  type: ProposalType;

  @JoinColumn({ name: 'fileId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  file?: LocalFile;

  @Column({ nullable: true })
  fileId?: number;
}
