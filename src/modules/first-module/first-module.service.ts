import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstModule } from './entities/first-module.entity';

@Injectable()
export class FirstModuleService {
  constructor(
    @InjectRepository(FirstModule)
    private firstModuleRepository: Repository<FirstModule>,
  ) {}

  async findAll() {
    const allFirstModules = await this.firstModuleRepository
      .createQueryBuilder('firstModule')
      .getMany();
    return allFirstModules;
  }
}
