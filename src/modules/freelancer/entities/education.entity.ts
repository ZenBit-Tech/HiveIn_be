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
export class Education {
  @ApiProperty({
    description: 'Id of education entity',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'City in which the education was received',
    example: 'London',
  })
  @Column()
  city: string;

  @ApiProperty({
    description: 'Degree of education',
    example: 'bachelor',
  })
  @Column()
  degree: string;

  @ApiProperty({
    description: 'Description of education',
    example:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  })
  @Column()
  description: string;

  @ApiProperty({
    description:
      'Name of the educational institution where the education was received',
    example: 'Harvard University',
  })
  @Column()
  school: string;

  @ApiProperty({
    description: 'Date when you start education',
    type: Date,
  })
  @Column()
  startDate: Date;

  @ApiProperty({
    description: 'Date when you end education',
    type: Date,
  })
  @Column()
  endDate: Date;

  @ApiProperty({
    description: 'Date when education entity was created',
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last date when education entity was changed',
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    description: 'Freelancer, who has received education',
    type: () => Freelancer,
  })
  @ManyToOne(() => Freelancer, (freelancer) => freelancer.education, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: Freelancer;

  @ApiProperty({
    description: 'Id of freelancer, who has received education',
    example: 1,
  })
  @Column()
  freelancerId: number;
}
