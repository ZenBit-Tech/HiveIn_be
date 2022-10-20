import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}
  create({ name }: CreateSkillDto): Promise<Skill> {
    return this.skillRepository.save({
      name,
    });
  }

  findAll(): Promise<Skill[]> {
    return this.skillRepository.find();
  }
}
