export interface IamwebOrderModel {
    id: number;
    created: Date;
    updated: Date;
    order_no: string;
    order_time: string;
    order_title: string;
    order_info: string;
    orderer_member_code: string;
    orderer_name: string;
    orderer_email: string;
    orderer_phone: string;
    delivery_country: string;
    delivery_country_text: string;
    payment_pay_type: string;
    payment_price_currency: string;
    payment_total_price: number;
    pay_time: string;
    options: string;
}
