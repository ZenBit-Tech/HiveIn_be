import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class ProfileSkills {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  profile_id: number;

  @Column({ type: 'int' })
  skills_id: number;
}
