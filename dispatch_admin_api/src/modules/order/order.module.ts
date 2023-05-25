import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/config/core/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { IamwebOrderBatch } from './iamweb.order.batch';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [OrderController],
  providers: [OrderService, IamwebOrderBatch],
})
export class OrderModule {}
