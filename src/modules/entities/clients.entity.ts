import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Freelancers } from './freelancers.entity';
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

  @ManyToMany(() => Freelancers)
  @JoinTable()
  recentlyViewedFreelancers: Freelancers[];
}
