import { Users } from 'src/modules/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Freelancers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  englishLevel: string;

  @Column()
  position: string;

  @Column()
  rate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;

  @Column()
  categoryId: number;
}
