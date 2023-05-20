import { Test, TestingModule } from '@nestjs/testing';
import { IamwebService } from './iamweb.service';

describe('IamwebService', () => {
  let service: IamwebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IamwebService],
    }).compile();

    service = module.get<IamwebService>(IamwebService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
