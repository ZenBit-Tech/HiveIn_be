import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';
import { Initiator, Status } from 'src/modules/offer/typesDef';
import { Freelancer } from '../../freelancer/entities/freelancer.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Initiator,
  })
  initiator: Initiator;

  @ManyToOne(() => JobPost)
  @JoinColumn({ name: 'jobPostId' })
  jobPostId: number;

  @ManyToOne(() => Freelancer)
  @JoinColumn({ name: 'freelancerId' })
  freelancerId: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.IN_CONSIDERATION,
  })
  status: Status;
}
