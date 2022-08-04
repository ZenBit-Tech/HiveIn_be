import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FirstModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  helloWorld: boolean;
}
