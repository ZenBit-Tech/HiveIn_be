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
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  description: string;

  @Column()
  employeer: string;

  @Column()
  jobTitle: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.experience, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @Column()
  freelancerId: number;
}
