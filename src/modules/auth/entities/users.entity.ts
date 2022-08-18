import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @OneToOne(() => Freelancer, (freelancer) => freelancer.user)
  freelancer: Freelancer;
}
