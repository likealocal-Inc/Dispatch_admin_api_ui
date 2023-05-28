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
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';

@AUTH_MUST()
@Controller('dispath')
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
  async findAll(@Query() pagingDto: PagingDto) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.listOrderWithUser(pagingDto),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.findOne(+id),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.orderService.update(+id, updateOrderDto),
    );
  }

  @Patch('status/:id/:status')
  async updateDispatchRequestForIamweb(
    @Param('id') id: string,
    @Param('status') status: string,
  ) {
    try {
      return HttpUtils.makeAPIResponse(
        true,
        await this.orderService.updateStatus(+id, status),
      );
    } catch {
      throw new CustomException(ExceptionCodeList.ERROR);
    }
  }
}
