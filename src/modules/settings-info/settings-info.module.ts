import { Module } from '@nestjs/common';
import { SettingsInfoService } from './settings-info.service';
import { SettingsInfoController } from './settings-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from '../freelancer/entities/freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Freelancer])],
  controllers: [SettingsInfoController],
  providers: [SettingsInfoService],
})
export class SettingsInfoModule {}
