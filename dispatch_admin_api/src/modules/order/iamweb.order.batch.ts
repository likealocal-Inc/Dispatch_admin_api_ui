import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { DefaultConfig } from 'src/config/default.config';
import { NewIamwebOrderModel } from 'src/libs/core/models/iamweb.order.model';
import { IamwebUtils } from 'src/libs/core/utils/iamweb.utils';

@Injectable()
export class IamwebOrderBatch {
  iamwebUtils: IamwebUtils;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.iamwebUtils = new IamwebUtils(this.httpService);
  }

  @Cron('1 * * * * *')
  async orderBatch() {
    const info = '아임웹 주문데이터 조회';
    console.log(`----------- ${info} -------------`);
    const res: NewIamwebOrderModel[] =
      await this.iamwebUtils.getOrderListFromIamweb(this.prisma);

    if (res === undefined) return;
    for (let index = 0; index < res.length; index++) {
      const d = res[index];
      await this.prisma.orders.create({
        data: {
          is_iamweb: true,
          iamweb_order_no: d.order_no,

          order_time: '' + d.order_time,
          order_title: d.order_title,

          boarding_date: d.boarding_date,
          boarding_time: d.boarding_time,

          startLocation: d.start_name,
          startAddress: d.start_address,
          startAirport: d.start_airport,

          goalLocation: d.goal_name,
          goalAddress: d.goal_address,
          goalAirport: d.goal_airport,

          information: JSON.stringify(d.info),

          else01: '',
          else02: '',

          userId: +DefaultConfig.iamwebApi.iamwebOrderUserId,
        },
      });
    }
  }
}
