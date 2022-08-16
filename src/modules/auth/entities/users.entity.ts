import { SettingsInfo } from 'src/modules/settings-info/entities/settings-info.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

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

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  googleId: string;

  @OneToOne(() => SettingsInfo, (settings) => settings.user)
  @JoinColumn()
  settingsInfo: SettingsInfo;
}
