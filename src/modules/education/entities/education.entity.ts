import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  degree: string;

  @Column()
  description: string;

  @Column()
  school: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.education)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @Column()
  freelancerId: number;
}
