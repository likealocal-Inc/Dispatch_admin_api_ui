import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from '../../libs/core/dtos/paging';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    return this.prisma.orders.create({
      data: { ...createOrderDto, userId },
    });
  }

  async findAll(pagingDto: PagingDto) {
    let count;
    let orders;
    const skip = +pagingDto.page;
    const take = +pagingDto.size;

    await this.prisma.$transaction(async (tx) => {
      count = await tx.orders.count();
      orders = await tx.orders.findMany({
        skip,
        take,
        orderBy: { id: 'desc' },
      });
    });
    return {
      count,
      data: orders,
    };
  }

  async findOne(id: number) {
    return await this.prisma.orders.findFirst({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.orders.update({
      where: { id: id },
      data: updateOrderDto,
    });
  }
}
