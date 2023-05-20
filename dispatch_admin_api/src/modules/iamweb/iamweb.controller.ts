import { Controller, Get, Query } from '@nestjs/common';
import { IamwebService } from './iamweb.service';
import { PagingDto } from 'src/libs/core/dtos/paging';
import { HttpUtils } from 'src/libs/core/utils/http.utils';

@Controller('iamweb')
export class IamwebController {
  constructor(private readonly iamwebService: IamwebService) {}

  @Get('/get.orders')
  async getOrders(@Query() pagingDto: PagingDto) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.iamwebService.getOrders(pagingDto),
    );
  }
}
