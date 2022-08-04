import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFirstModuleDto } from './dto/create-first-module.dto';
import { FirstModule } from './entities/first-module.entity';

@Injectable()
export class FirstModuleService {
  constructor(
    @InjectRepository(FirstModule)
    private firstModuleRepository: Repository<FirstModule>,
  ) {}

  create(createFirstModuleDto: CreateFirstModuleDto) {
    console.log(createFirstModuleDto.helloWorld);
    this.firstModuleRepository.create({
      helloWorld: createFirstModuleDto.helloWorld,
    });
    return 'This action adds a new firstModule'
  }

  findAll() {
    console.log('findAll');
    return `This action returns all firstModule`
  }
}
