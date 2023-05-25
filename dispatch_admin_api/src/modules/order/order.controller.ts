import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { HttpUtils } from 'src/libs/core/utils/http.utils';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';
import { PagingDto } from 'src/libs/core/dtos/paging';

@AUTH_MUST()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const user = req.user;
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.create(createOrderDto, user.id),
    );
  }

  @Get()
  findAll(@Query() pagingDto: PagingDto) {
    return this.orderService.findAll(pagingDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
}
