import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Experiences {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne((type) => Profile, (profile) => profile.id)
  @JoinColumn({ name: 'profile_id' })
  profileId: Profile;
}
