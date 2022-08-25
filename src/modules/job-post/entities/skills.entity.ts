import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobPost } from './job-post.entity';

@Entity()
export class Skills {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => JobPost)
  jobPost: JobPost[];
}
