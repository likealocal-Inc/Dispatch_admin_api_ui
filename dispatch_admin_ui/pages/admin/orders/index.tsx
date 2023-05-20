import { useEffect, useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user_model";
import { getElementById } from "@libs/client/utils/html";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { callAPI } from "@libs/client/call/call";
import { MessageProps } from "@components/MessageShow/show";
import Button02 from "@components/buttons/Button02";
import TableTemplate from "@components/ListTable/TableTemplate";
import ManageUserModal from "../users/manageUser";
import { IamwebOrderModel } from "@libs/client/models/iamweb_order_model";
import { jsonToString } from "@libs/utils";
import { DateUtils } from "@libs/date.utils";

export default function Orders() {
  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();

  // 화면 재로딩
  const [reload, setReload] = useState(0);

  // 모달 관련 설정
  const [isModify, setIsModify] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [orders, setOrders] = useState<IamwebOrderModel>();

  const handleModalOpen = (order: IamwebOrderModel) => {
    setOrders(order);
    setOpenModal(true);
  };

  const handleCreateModalOpen = () => {
    setIsModify(false);
    setOpenModal(true);
  };

  const handleModalClose = (isChange: boolean = false) => {
    setOpenModal(false);
    if (isChange) setReload(reload + 1);
  };

  const headers = [
    "ID",
    "주문 No",
    "주문일시",
    "주문상품",
    "주문정보",
    "이름",
    "이메일",
    "연락처",
    "결제금액",
    "기타데이터",
    "배차",
  ];
  const headerWidths = [1, 1, 10, 10, 30, 5, 1, 1, 10, 20, 1];
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
              <Button02 onClick={() => handleModalOpen(d)} label={d.id} />
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.order_no}
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: DateUtils.stringToDate(d.order_time),
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.order_title}
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: jsonToString(JSON.parse(d.order_info)),
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.orderer_name}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.orderer_email}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.orderer_phone}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.payment_total_price}[{d.payment_price_currency}]/
              {d.payment_pay_type}/{DateUtils.stringToDate(d.pay_time)}
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: jsonToString(JSON.parse(d.options)),
              }}
            >
              {/* {jsonToString(JSON.parse(d.options))} */}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <Button02
                label={"배차"}
                onClick={() => {
                  // callAPI({
                  //   urlInfo: {
                  //     url: `${APIURLs.USER_DELETE.url}/${d.id}`,
                  //     method: APIURLs.USER_DELETE.method,
                  //     desc: APIURLs.USER_DELETE.desc,
                  //   },
                  // }).then((res) => {
                  //   location.reload();
                  // });
                }}
              />
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
        {/* 
        <ManageUserModal
          isModify={isModify}
          open={openModal}
          user={selectUser}
          handleModalClose={handleModalClose}
        /> */}
      </div>
    </>
  );
}
