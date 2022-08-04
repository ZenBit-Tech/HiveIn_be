import { Module } from '@nestjs/common';
import { FirstModuleService } from './first-module.service';
import { FirstModuleController } from './first-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstModule } from './entities/first-module.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([FirstModule]) /* DatabaseModule */],
  controllers: [FirstModuleController],
  providers: [FirstModuleService],
})
export class FirstModuleModule {}
