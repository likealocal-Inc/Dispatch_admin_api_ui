import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { IamwebService } from './iamweb.service';
import { PagingDto } from 'src/libs/core/dtos/paging';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { OrdersIamwebEntity } from './entities/iamweb.entity';

@Controller('iamweb')
export class IamwebController {
  constructor(private readonly iamwebService: IamwebService) {}

  @Get('/get.orders')
  async getOrders(@Query() pagingDto: PagingDto): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.iamwebService.getOrders(pagingDto),
    );
  }

  @Patch()
  async modify(
    @Body() ordersIamwebEntity: OrdersIamwebEntity,
  ): Promise<APIResponseObj> {
    const res = await this.iamwebService.modify(ordersIamwebEntity);
    return HttpUtils.makeAPIResponse(true, res);
  }
}
