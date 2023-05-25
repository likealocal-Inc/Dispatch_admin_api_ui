export const IamwebUtils = {
  statusMap: new Map<string, string>([
    ["DISPATCH_ING", "확인중"],
    ["DISPATCH_COMPLETE", "배차완료"],
    ["DISPATCH_NO", "미배차"],
    ["DISPATCH_CANCEL", "배차취소"],
    ["DONE", "완료"],
  ]),
  getStatusString: (status: string): string => {
    return IamwebUtils.statusMap.get(status) ?? "ERROR";
  },
};
