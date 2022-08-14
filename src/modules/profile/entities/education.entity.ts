import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class Education {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'datetime', name: 'start_date' })
  startDate: string;

  @Column({ type: 'datetime', name: 'end_date' })
  endDate: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne((type) => Profile, (profile) => profile.education)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;
}
