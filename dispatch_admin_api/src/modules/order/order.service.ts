import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { PagingDto } from '../../libs/core/dtos/paging';
import { CUserService } from 'src/core/c.user/c.user.service';
import { OrderEntity } from './entities/order.entity';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';
import { ListOrderDto } from './dto/list.order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: CUserService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    return this.prisma.orders.create({
      data: { ...createOrderDto, userId },
    });
  }

  /**
   * 주문 리스트 요청
   * @param pagingDto
   * @returns
   */
  async listOrderWithUser(pagingDto: PagingDto) {
    const orders = await this.findAll(pagingDto);

    const res = { count: orders.count, data: [] };
    const data = [];
    const userMap = new Map<number, CUserEntity>();

    for (let index = 0; index < orders.data.length; index++) {
      const order: OrderEntity = orders.data[index];
      console.log(order);
      let mapUser: CUserEntity = userMap.get(order.userId);
      if (mapUser === null || mapUser == undefined) {
        mapUser = await this.userService.findId(order.userId);
      }
      const listOrderDto: ListOrderDto = new ListOrderDto(order);
      listOrderDto.user = mapUser;

      data.push(listOrderDto);
    }

    res.data = data;

    return res;
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
