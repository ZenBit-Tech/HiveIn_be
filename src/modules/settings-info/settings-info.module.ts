import { Module } from '@nestjs/common';
import { SettingsInfoService } from 'src/modules/settings-info/settings-info.service';
import { SettingsInfoController } from 'src/modules/settings-info/settings-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/modules/entities/users.entity';
import { Freelancer } from 'src/modules/freelancer/entities/freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Freelancer])],
  controllers: [SettingsInfoController],
  providers: [SettingsInfoService],
})
export class SettingsInfoModule {}
