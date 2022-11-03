import { Controller, Get, Post, Body } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Skill')
@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @ApiCreatedResponse({
    description: 'Created skill',
    type: () => Skill,
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
  })
  @Post()
  create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    return this.skillService.create(createSkillDto);
  }

  @ApiCreatedResponse({
    description: 'All skills',
    type: [Skill],
  })
  @Get()
  findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }
}
