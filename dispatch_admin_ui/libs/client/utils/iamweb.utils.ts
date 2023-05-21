export const IamwebUtils = {
  statusMap: new Map<string, string>([
    ["ORDER_PAYMENT_OK", "주문입금완료"],
    ["DISPATCH_REQUEST", "배차요청"],
    ["DISPATCH_COMPLETE", "배차완료"],
    ["CANCEL", "취소"],
    ["DONE", "완료"],
  ]),
  getStatusString: (status: string): string => {
    return IamwebUtils.statusMap.get(status) ?? "ERROR";
  },
};
