import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from 'src/modules/entities/users.entity';

@Entity()
export class RecentlyViewedFreelancers {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(
    () => Freelancer,
    (freelancer) => freelancer.recentlyViewedFreelancers,
  )
  freelancer: Freelancer;

  @ManyToOne(() => Users, (user) => user.recentlyViewedFreelancers)
  user: Users;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
