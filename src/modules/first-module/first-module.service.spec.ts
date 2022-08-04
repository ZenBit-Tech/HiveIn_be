import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstModule } from './entities/first-module.entity';
import { FirstModuleService } from './first-module.service';

describe('FirstModuleService', () => {
  let service: FirstModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{provide: FirstModuleService, useValue: {
        get: jest.fn(() => true)
      }}],
    }).compile();

    service = module.get<FirstModuleService>(FirstModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
