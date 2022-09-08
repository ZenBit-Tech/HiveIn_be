import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';
import { Proposal } from 'src/modules/proposal/entities/proposal.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ContractStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Proposal, (proposal) => proposal.id)
  proposalID: Proposal;

  @ManyToOne(() => Users, (user) => user.id)
  hiringManagerId: Users;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.id)
  freelancerId: Freelancer;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  contractStatus: ContractStatus;

  @CreateDateColumn()
  startTime: Date;

  @Column()
  endTime: Date;
}
