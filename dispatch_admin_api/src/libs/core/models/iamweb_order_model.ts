import { DefaultConfig } from 'src/config/default.config';

export class IamwebOrderModel {
  code;
  order_no;
  status;
  claim_status;
  claim_type;
  pay_time = -1;
  delivery_time = -1;
  complete_time = -1;
  parcel_code;
  invoice_no;
  items = {
    no: '',
    prod_no: '',
    prod_name: '',
    prod_custom_code: '',
    prod_sku_no: '',
    payment: {
      count: '',
      price: '',
      price_tax_free: '',
      deliv_price_tax_free: '',
      deliv_price: '',
      island_price: '',
      price_sale: '',
      point: '',
      coupon: '',
      membership_discount: '',
      period_discount: '',
    },
    delivery: {
      deliv_code: '',
      deliv_price_mix: '',
      deliv_group_code: '',
      deliv_type: '',
      deliv_pay_type: '',
      deliv_price_type: '',
    },
    startLocation: '',
    startAddress: '',
    endLocation: '',
    endAddress: '',
    startAirport: '',
    endAirport: '',
    wayPoint: '', // 경유지
    rentTime: '', // 대절시간
    orderType: '', // 대절/
  };

  constructor(data: any) {
    this.code = data.code;
    this.order_no = data.order_no;
    this.status = data.status;
    this.claim_status = data.claim_status;
    this.claim_type = data.claim_type;
    this.pay_time = data.pay_time;
    this.delivery_time = data.delivery_time;
    this.complete_time = data.complete_time;
    this.parcel_code = data.parcel_code;
    this.invoice_no = data.invoice_no;

    const items = data.items[0];
    this.items.no = items.no;
    this.items.prod_no = items.prod_no;
    this.items.prod_name = items.prod_name;
    this.items.prod_custom_code = items.prod_custom_code;
    this.items.prod_sku_no = items.prod_sku_no;

    this.items.payment.count = items.payment.count;
    this.items.payment.price = items.payment.price;
    this.items.payment.price_tax_free = items.payment.price_tax_free;
    this.items.payment.deliv_price_tax_free =
      items.payment.deliv_price_tax_free;
    this.items.payment.deliv_price = items.payment.deliv_price;
    this.items.payment.island_price = items.payment.island_price;
    this.items.payment.price_sale = items.payment.price_sale;
    this.items.payment.point = items.payment.point;
    this.items.payment.coupon = items.payment.coupon;
    this.items.payment.membership_discount = items.payment.membership_discount;
    this.items.payment.period_discount = items.payment.period_discount;

    this.items.delivery.deliv_code = items.delivery.deliv_code;
    this.items.delivery.deliv_price_mix = items.delivery.deliv_price_mix;
    this.items.delivery.deliv_group_code = items.delivery.deliv_group_code;
    this.items.delivery.deliv_type = items.delivery.deliv_type;
    this.items.delivery.deliv_pay_type = items.delivery.deliv_pay_type;
    this.items.delivery.deliv_price_type = items.delivery.deliv_price_type;

    if (items.options !== undefined) {
      const options = items.options[0][0].value_name_list;

      const productType = DefaultConfig.iamwebApi.iamwebProductID;

      // 서울 -> 공항
      if (this.items.prod_no.toString() === productType.sanding.toString()) {
        this.items.startAddress = options[0];
        this.items.startLocation = options[2];
        this.items.endLocation = options[1];
        this.items.endAddress = '';
        this.items.startAirport = options[1];
        this.items.wayPoint = '';
        this.items.rentTime = '';
        this.items.orderType = '편도';
      }
      // 공항 -> 서울
      else if (
        this.items.prod_no.toString() === productType.pickup.toString()
      ) {
        this.items.startAddress = '';
        this.items.startLocation = options[1];
        this.items.endLocation = options[0];
        this.items.endAddress = options[2];
        this.items.endAirport = options[1];
        this.items.wayPoint = '';
        this.items.rentTime = '';
        this.items.orderType = '편도';
      } else {
        this.items.startLocation = options[0]; // 출발지
        this.items.wayPoint = options[1];
        this.items.startAddress = ''; // options[1]; // 경유
        this.items.endLocation = options[2]; // 목적지
        this.items.rentTime = options[3];
        this.items.endAddress = ''; //options[3]; // 대절시간
        this.items.orderType = '대절';
      }
    }
  }
}
