import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobPost } from 'src/modules/job-post/entities/job-post.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @ManyToMany(() => Freelancer)
  freelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  jobPosts: JobPost[];
}
