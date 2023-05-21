import { useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { MessageProps } from "@components/MessageShow/show";
import Button02 from "@components/buttons/Button02";
import TableTemplate from "@components/ListTable/TableTemplate";
import { jsonToString } from "@libs/utils";
import { DateUtils } from "@libs/date.utils";
import { IamwebUtils } from "@libs/client/utils/iamweb.utils";
import ModalOrderIamwebModify from "@components/Modals/ModalOrderIamwebModify";
import { IamwebOrderModel } from "@libs/client/models/iamweb.order.model";
import { callAPI } from "@libs/client/call/call";

export default function Orders() {
  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();
  const [data, setData] = useState("");
  const [isJson, setIsJson] = useState(false);

  const [modifyCallback, setModifyCallback] = useState<Function>(
    () => () => {}
  );
  // 화면 재로딩
  const [reload, setReload] = useState(0);

  // 모달 관련 설정
  const [openModal, setOpenModal] = useState<boolean>(false);

  const headers = [
    "ID",
    "상태",
    "주문 No",
    "주문일시",
    "주문상품",
    "주문정보",

    "이름",
    "이메일",
    "연락처",

    "결제타입",
    "결제금액",
    "결제시간",

    "옵션",

    "배차상태",
  ];
  const headerWidths = [0.5, 10, 0.4, 10, 20, 30, 20, 1, 1, 1, 1, 1, 30, 2];
  const body = (res: IamwebOrderModel[]) => {
    return (
      res &&
      res.map((d, key) => {
        return (
          <StyledTableRow
            key={key}
            className='transition duration-300 ease-in-out border-b hover:bg-gray-300'
          >
            <StyledTableCell component='th' scope='row'>
              {d.id}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>
                {IamwebUtils.getStatusString(d.status)}
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>{d.order_no}</div>
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: DateUtils.stringToDate(d.order_time),
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>{d.order_title}</div>
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              onDoubleClick={() => {
                setIsJson(true);
                setData(d.order_info);
                setOpenModal(true);
                const fn = (orderData: string) => {
                  d.order_info = orderData;
                  callAPI({ urlInfo: APIURLs.ORDER_MODIFY, params: d });
                  location.reload();
                };
                setModifyCallback(() => fn);
              }}
              dangerouslySetInnerHTML={{
                __html: jsonToString(JSON.parse(d.order_info)),
              }}
            ></StyledTableCell>

            <StyledTableCell component='th' scope='row'>
              <div
                className=''
                onDoubleClick={() => {
                  setData(d.orderer_name);
                  setOpenModal(true);
                  const fn = (orderData: string) => {
                    d.orderer_name = orderData;
                    callAPI({ urlInfo: APIURLs.ORDER_MODIFY, params: d });
                    location.reload();
                  };
                  setModifyCallback(() => fn);
                }}
              >
                <div className='text-xs'>{d.orderer_name}</div>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div
                className=''
                onDoubleClick={() => {
                  setData(d.orderer_email);
                  setOpenModal(true);
                  const fn = (orderData: string) => {
                    d.orderer_email = orderData;
                    callAPI({ urlInfo: APIURLs.ORDER_MODIFY, params: d });
                    location.reload();
                  };
                  setModifyCallback(() => fn);
                }}
              >
                <div className='text-xs'>{d.orderer_email}</div>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div
                className=''
                onDoubleClick={() => {
                  setData(d.orderer_phone);
                  setOpenModal(true);
                  const fn = (orderData: string) => {
                    d.orderer_phone = orderData;
                    callAPI({ urlInfo: APIURLs.ORDER_MODIFY, params: d });
                    location.reload();
                  };
                  setModifyCallback(() => fn);
                }}
              >
                <div className='text-xs'>{d.orderer_phone}</div>
              </div>
            </StyledTableCell>

            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>{d.payment_pay_type}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>
                {d.payment_total_price}/{d.payment_price_currency}
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>
                {DateUtils.stringToDate(d.pay_time)}
              </div>
            </StyledTableCell>

            <StyledTableCell
              component='th'
              scope='row'
              onDoubleClick={() => {
                setIsJson(true);
                setData(d.options);
                setOpenModal(true);
                const fn = (orderData: string) => {
                  d.options = orderData;
                  callAPI({ urlInfo: APIURLs.ORDER_MODIFY, params: d });
                  location.reload();
                };
                setModifyCallback(() => fn);
              }}
              dangerouslySetInnerHTML={{
                __html: jsonToString(JSON.parse(d.options)),
              }}
            >
              {/* {jsonToString(JSON.parse(d.options))} */}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <Button02 label={"배차요청"} onClick={() => {}} />
            </StyledTableCell>
          </StyledTableRow>
        );
      })
    );
  };

  return (
    <>
      <div className='h-screen p-5 bg-gray-500'>
        <TableTemplate
          title='아임웹 주문 관리'
          headers={headers}
          headerWidths={headerWidths}
          body={body}
          listCallUrl={APIURLs.ORDER_LIST}
          reload={reload}
          message={message!}
          setMessage={setMessage}
        />

        <ModalOrderIamwebModify
          isJson={isJson}
          modifyCallback={modifyCallback}
          isOpen={openModal}
          setIsOpen={setOpenModal}
          data={data}
          setData={setData}
        />
      </div>
    </>
  );
}
