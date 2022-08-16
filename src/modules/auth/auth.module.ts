import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SettingsInfo } from 'src/modules/settings-info/entities/settings-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, SettingsInfo])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
