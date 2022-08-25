import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobPost } from './job-post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  name: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.category)
  @JoinColumn()
  jobPost: JobPost;
}
