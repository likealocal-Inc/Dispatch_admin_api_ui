import { OrderStatus, Orders } from '@prisma/client';

export class OrderEntity implements Orders {
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
}
