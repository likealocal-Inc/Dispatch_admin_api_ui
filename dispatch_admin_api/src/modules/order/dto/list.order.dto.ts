import { OrderStatus, Orders } from '@prisma/client';
import { CUserEntity } from 'src/core/c.user/entities/c.user.entity';
import { OrderEntity } from '../entities/order.entity';

export class ListOrderDto implements Orders {
  id: number;
  created: Date;
  updated: Date;
  is_iamweb: boolean;
  iamweb_order_no: string;
  order_time: string;
  order_title: string;
  boarding_date: string;
  boarding_time: string;
  startLocation: string;
  startAddress: string;
  goalLocation: string;
  goalAddress: string;
  startAirport: string;
  goalAirport: string;
  information: string;
  else01: string;
  else02: string;
  status: OrderStatus;
  userId: number;
  user: CUserEntity;

  constructor(orderEntidy: OrderEntity) {
    this.id = orderEntidy.id;
    this.created = orderEntidy.created;
    this.updated = orderEntidy.updated;
    this.is_iamweb = orderEntidy.is_iamweb;
    this.iamweb_order_no = orderEntidy.iamweb_order_no;
    this.order_time = orderEntidy.order_time;
    this.order_title = orderEntidy.order_title;
    this.boarding_date = orderEntidy.boarding_date;
    this.boarding_time = orderEntidy.boarding_time;
    this.startLocation = orderEntidy.startLocation;
    this.startAddress = orderEntidy.startAddress;
    this.goalLocation = orderEntidy.goalLocation;
    this.goalAddress = orderEntidy.goalAddress;
    this.startAirport = orderEntidy.startAirport;
    this.goalAirport = orderEntidy.goalAirport;
    this.information = orderEntidy.information;
    this.else01 = orderEntidy.else01;
    this.else02 = orderEntidy.else02;
    this.status = orderEntidy.status;
    this.userId = orderEntidy.userId;
  }
}
