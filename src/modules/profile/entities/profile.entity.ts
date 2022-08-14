import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Categories } from './categories.entity';
import { Education } from './education.entity';
import { Experiences } from './experiences.enity';

export type EnglishLevel =
  | 'Pre-intermediate'
  | 'Intermediate'
  | 'Upper-intermediate';

// id?: number;
// userId: string;
// photoURL: string;
// position: string;
// categoryId: number;
// rate: number;
// englishLevel: string;
// description: string;
// createdAt: string;
// update: string;
@Entity()
export class Profile {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'datetime', name: 'created_at' })
  createdAt: string;

  @Column({ type: 'datetime', name: 'updated_at' })
  updatedAt: string;

  @Column('int', { name: 'user_id' })
  userId: number;

  @Column()
  photoURL: string;

  @Column()
  position: string;

  @Column('int')
  rate: number;

  @Column({
    type: 'enum',
    enum: ['Pre-intermediate', 'Intermediate', 'Upper-intermediate'],
    default: 'Pre-intermediate',
  })
  englishLevel: EnglishLevel;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne((type) => Categories, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  categoryId: Categories;

  @OneToMany((type) => Education, (education) => education.id)
  education: Education[];

  @OneToMany((type) => Experiences, (experience) => experience.id)
  experience: Experiences[];
}
