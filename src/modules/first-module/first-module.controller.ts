import { Controller, Get, Post, Body } from '@nestjs/common';
import { FirstModuleService } from './first-module.service';
import { CreateFirstModuleDto } from './dto/create-first-module.dto';

@Controller('first-module')
export class FirstModuleController {
  constructor(private readonly firstModuleService: FirstModuleService) {}

  @Post()
  create(@Body() createFirstModuleDto: CreateFirstModuleDto) {
    return this.firstModuleService.create(createFirstModuleDto);
  }

  @Get()
  findAll() {
    return this.firstModuleService.findAll();
  }
}
