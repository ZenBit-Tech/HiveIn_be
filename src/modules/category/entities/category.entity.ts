import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({
    description: 'Id of category',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of category',
    example: 'IT',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Date of created category',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date of updated category',
  })
  @UpdateDateColumn()
  UpdatedAt: Date;
}
