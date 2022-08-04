import { Test, TestingModule } from '@nestjs/testing';
import { FirstModuleService } from './first-module.service';

describe('FirstModuleService', () => {
  let service: FirstModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FirstModuleService,
          useValue: {
            get: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    service = module.get<FirstModuleService>(FirstModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
