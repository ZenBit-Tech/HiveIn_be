import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Users } from 'src/modules/auth/entities/users.entity';

@Entity()
export class SettingsInfo {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @OneToOne(() => Users, (user) => user.settingsInfo)
  user: Users;
}
