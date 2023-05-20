import { Test, TestingModule } from '@nestjs/testing';
import { IamwebController } from './iamweb.controller';
import { IamwebService } from './iamweb.service';

describe('IamwebController', () => {
  let controller: IamwebController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamwebController],
      providers: [IamwebService],
    }).compile();

    controller = module.get<IamwebController>(IamwebController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
