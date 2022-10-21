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
import { ApiProperty } from '@nestjs/swagger';

export enum ProposalType {
  PROPOSAL = 'proposal',
  INVITE = 'invite',
}

@Entity()
export class Proposal {
  @ApiProperty({
    description: 'Id of proposal',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Text message of proposal',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Column()
  message: string;

  @ApiProperty({
    description: 'Bid of job',
    example: 30,
  })
  @Column()
  bid: number;

  @ApiProperty({
    description: 'Job post of proposal',
    type: JobPost,
  })
  @ManyToOne(() => JobPost, (jobPost) => jobPost.id, { cascade: true })
  @JoinColumn()
  jobPost: JobPost;

  @ApiProperty({
    description: 'Freelancer who sent proposal',
    type: Freelancer,
  })
  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id, { cascade: true })
  @JoinColumn()
  freelancer: Freelancer;

  @ApiProperty({
    description: 'Type of proposal',
    type: ProposalType,
    example: ProposalType.INVITE,
  })
  @Column({
    type: 'enum',
    enum: ProposalType,
  })
  type: ProposalType;

  @ApiProperty({
    description: 'File that attached to proposal',
    type: LocalFile,
    required: false,
  })
  @JoinColumn({ name: 'fileId' })
  @OneToOne(() => LocalFile, {
    eager: true,
    nullable: true,
  })
  file?: LocalFile;
}
