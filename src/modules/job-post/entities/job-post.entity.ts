import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Skills } from './skills.entity';

export enum DurationType {
  WEEK = 'week',
  MONTH = 'month',
}
export enum EnglishLevel {
  PRE_INTERMEDIATE = 'Pre-intermediate',
  INTERMEDIATE = 'Intermediate',
  UPPER_INTERMEDIATE = 'Upper-intermediate',
}

@Entity()
export class JobPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  duration: number;

  @Column({
    type: 'enum',
    enum: DurationType,
    default: DurationType.WEEK,
  })
  durationType: DurationType;

  @ManyToOne(() => Category, (category) => category.id, { cascade: true })
  @JoinColumn()
  category: Category;

  @Column()
  rate: number;

  @ManyToMany(() => Skills, (skills) => skills.jobPost, {
    cascade: true,
  })
  @JoinTable({
    name: 'job_posts_skills',
    joinColumn: { name: 'job_post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skills[];

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'text' })
  jobDescription: string;
}
