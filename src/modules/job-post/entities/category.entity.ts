import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobPost } from './job-post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => JobPost, (jobPost) => jobPost.id)
  jobPost: JobPost[];
}
