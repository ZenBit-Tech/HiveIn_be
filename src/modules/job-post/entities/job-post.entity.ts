import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Users } from 'src/modules/entities/users.entity';

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

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: Users;

  @Column()
  rate: number;

  @ManyToMany(() => Skill, (skills) => skills.jobPosts, {
    cascade: true,
  })
  @JoinTable()
  skills: Skill[];

  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.PRE_INTERMEDIATE,
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'text' })
  jobDescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
