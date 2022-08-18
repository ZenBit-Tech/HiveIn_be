import { Users } from 'src/modules/entities/users.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Education } from 'src/modules/education/entities/education.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
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

@Entity()
export class Freelancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  englishLevel: string;

  @Column()
  position: string;

  @Column()
  rate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @OneToMany(() => Education, (education) => education.freelancer, {
    cascade: true,
    nullable: true,
  })
  education: Education[];

  @OneToMany(() => Experience, (experience) => experience.freelancer, {
    cascade: true,
    nullable: true,
  })
  experience: Experience[];

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
