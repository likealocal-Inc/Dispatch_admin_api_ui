import { Module } from '@nestjs/common';
import { IamwebService } from './iamweb.service';
import { IamwebController } from './iamweb.controller';
import { HttpModule } from '@nestjs/axios';
import { IamwebOrderBatch } from './iamweb.order.batch';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [IamwebController],
  providers: [IamwebService, IamwebOrderBatch],
})
export class IamwebModule {}
