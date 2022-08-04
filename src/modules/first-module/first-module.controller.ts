import { Controller, Get } from '@nestjs/common';
import { FirstModuleService } from './first-module.service';

@Controller('first-module')
export class FirstModuleController {
  constructor(private readonly firstModuleService: FirstModuleService) {}

  @Get()
  findAll() {
    return this.firstModuleService.findAll();
  }
}
