import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Skills {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  title: string;
}
