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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Skill {
  @ApiProperty({
    description: 'Id of skill',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of skill',
    example: 'smm',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Date of created skill',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date of updated skill',
  })
  @UpdateDateColumn()
  UpdatedAt: Date;

  @ManyToMany(() => Freelancer)
  freelancers: Freelancer[];

  @ManyToMany(() => JobPost)
  jobPosts: JobPost[];
}
