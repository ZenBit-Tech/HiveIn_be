import { Module } from '@nestjs/common';
import { SettingsInfoService } from './settings-info.service';
import { SettingsInfoController } from './settings-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsInfo } from 'src/modules/settings-info/entities/settings-info.entity';
import { Users } from 'src/modules/auth/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsInfo, Users])],
  controllers: [SettingsInfoController],
  providers: [SettingsInfoService],
})
export class SettingsInfoModule {}
