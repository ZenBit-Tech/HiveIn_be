import { Module } from '@nestjs/common';
import { FirstModuleService } from './first-module.service';
import { FirstModuleController } from './first-module.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FirstModule } from './entities/first-module.entity';

interface mockRepository {}

@Module({
  imports: [TypeOrmModule.forFeature([FirstModule])],
  controllers: [FirstModuleController],
  providers: [FirstModuleService],
})
export class FirstModuleModule {}
