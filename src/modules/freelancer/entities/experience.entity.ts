import { Freelancer } from './freelancer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Experience {
  @ApiProperty({
    description: 'Id of experience entity',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'City where you got experience',
    example: 'London',
  })
  @Column()
  city: string;

  @ApiProperty({
    description: 'Description of experience',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Name of post that you has on your job',
    example: 'Junior developer',
  })
  @Column()
  employer: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Frontend developer',
  })
  @Column()
  jobTitle: string;

  @ApiProperty({
    description: 'Date when you start work',
    type: Date,
  })
  @Column()
  startDate: Date;

  @ApiProperty({
    description: 'Date when you end work',
    type: Date,
  })
  @Column()
  endDate: Date;

  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    description: 'Date when experience entity was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last date when experience entity was changed',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Freelancer, who had experience of work',
    type: () => Freelancer,
  })
  @ManyToOne(() => Freelancer, (freelancer) => freelancer.experience, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @ApiProperty({
    description: 'Id of freelancer, who had experience of work',
    example: 1,
  })
  @Column()
  freelancerId: number;
}
