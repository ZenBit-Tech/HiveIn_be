import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  role: string;
}
