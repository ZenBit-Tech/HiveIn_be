import { Test, TestingModule } from '@nestjs/testing';
import { FirstModuleController } from './first-module.controller';
import { FirstModuleService } from './first-module.service';

describe('FirstModuleController', () => {
  let controller: FirstModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirstModuleController],
      providers: [{
        provide: FirstModuleService,
        useValue: {
          get: jest.fn(() => true)
        }
      }],
    }).compile();

    controller = module.get<FirstModuleController>(FirstModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
