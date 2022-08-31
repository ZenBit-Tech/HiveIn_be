import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Freelancer } from '../freelancer/entities/freelancer.entity';
import { Users } from './users.entity';

@Entity()
export class Clients {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToMany(() => Freelancer)
  @JoinTable()
  recentlyViewedFreelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  savedFreelancers: Freelancer[];

  @ManyToMany(() => Freelancer)
  @JoinTable()
  hiredFreelancers: Freelancer[];
}
