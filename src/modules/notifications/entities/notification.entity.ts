import { Users } from 'src/modules/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromUserId: number;

  @Column()
  toUserId: number;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  type: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'fromUserId' })
  fromUser: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'toUserId' })
  toUser: Users;
}
