import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from 'src/libs/core/dtos/paging';
import { OrdersIamwebEntity } from './entities/iamweb.entity';

@Injectable()
export class IamwebService {
  constructor(private readonly prisma: PrismaService) {}

  // 수정
  async modify(
    ordersIamwebEntity: OrdersIamwebEntity,
  ): Promise<OrdersIamwebEntity> {
    return this.prisma.ordersIamweb.update({
      where: { id: ordersIamwebEntity.id },
      data: ordersIamwebEntity,
    });
  }

  async getOrders(pagingDto: PagingDto) {
    let count;
    let orders;
    const size = +pagingDto.size;
    const page = +pagingDto.page;
    await this.prisma.$transaction(async (tx) => {
      count = await tx.user.count();
      orders = await this.prisma.ordersIamweb.findMany({
        skip: page,
        take: size,
        orderBy: { id: 'desc' },
      });
    });
    return {
      count,
      page,
      size,
      data: orders,
    };
  }
}
