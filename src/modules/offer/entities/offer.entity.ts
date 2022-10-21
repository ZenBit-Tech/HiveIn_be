import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Status } from 'src/modules/offer/typesDef';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer {
  @ApiProperty({
    description: 'Id of offer',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Job post of offer',
    example: JobPost,
  })
  @ManyToOne(() => JobPost, (jobPost) => jobPost.offer)
  @JoinColumn({ name: 'jobPostId' })
  jobPost: JobPost;

  @ApiProperty({
    description: 'Freelancer who received offer',
    example: Freelancer,
  })
  @ManyToOne(() => Freelancer)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @ApiProperty({
    description: 'Date when offer was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Status of offer',
    example: Status.ACCEPTED,
    type: Status,
  })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;
}
