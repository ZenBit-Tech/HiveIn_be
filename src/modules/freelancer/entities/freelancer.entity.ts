import { Users } from 'src/modules/entities/users.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EnglishLevel } from 'src/modules/job-post/entities/job-post.entity';

@Entity()
export class Freelancer {
  @ApiProperty({
    description: 'English level of freelancer',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'English level of freelancer',
    enum: EnglishLevel,
  })
  @Column()
  englishLevel: string;

  @ApiProperty({
    description: 'Position of freelancer',
    example: 'Frontend developer',
  })
  @Column()
  position: string;

  @ApiProperty({
    description: 'Rate of freelancer',
    example: '30',
  })
  @Column()
  rate: string;

  @ApiProperty({
    description: 'Date when freelancer entity was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last date when freelancer entity was updated',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Category of freelancer',
    type: () => Category,
  })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({
    description: 'User of freelancer',
    type: () => Users,
  })
  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ApiProperty({
    description: 'Educations was received by the freelancer',
    type: [Education],
  })
  @OneToMany(() => Education, (education) => education.freelancer, {
    cascade: true,
    nullable: true,
  })
  education: Education[];

  @ApiProperty({
    description: 'Experiences of freelancer',
    type: [Experience],
  })
  @OneToMany(() => Experience, (experience) => experience.freelancer, {
    cascade: true,
    nullable: true,
  })
  experience: Experience[];

  @ApiProperty({
    description: 'Skills of freelancer',
    type: [Skill],
  })
  @ManyToMany(() => Skill, (skill) => skill.freelancers, {
    cascade: true,
  })
  @JoinTable()
  skills: Skill[];

  @Column()
  userId: number;

  @Column()
  categoryId: number;
}
