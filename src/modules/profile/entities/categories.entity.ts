import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  title: string;

  @Column({ type: 'int' })
  profile_id: number;

  @OneToMany((type) => Profile, (profile) => profile.categoryId)
  profiles: Profile[];
}
