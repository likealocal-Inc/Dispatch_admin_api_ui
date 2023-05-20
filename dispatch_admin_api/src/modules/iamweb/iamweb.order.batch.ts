import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
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

    for (let index = 0; index < res.length; index++) {
      const d = res[index];
      await this.prisma.ordersIamweb.create({
        data: {
          order_no: d.order_no,
          order_time: '' + d.order_time,
          order_title: d.order_title,
          order_info: JSON.stringify(d.order_infomation),
          orderer_member_code: d.orderer_member_code,
          orderer_name: d.orderer_name,
          orderer_email: d.orderer_email,
          orderer_phone: d.orderer_phone,
          delivery_country: d.delivery_country,
          delivery_country_text: d.delivery_country_text,
          payment_pay_type: d.payment_pay_type,
          payment_price_currency: d.payment_price_currency,
          payment_total_price: d.payment_total_price,
          pay_time: '' + d.pay_time,
          options: JSON.stringify(d.info),
        },
      });
    }
  }
}
