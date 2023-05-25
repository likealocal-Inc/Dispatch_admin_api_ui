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
    "배차상태",
    "ID",
    "주문일시",
    "주문상품",
    "소속/이름/직급",
    "연락처",
    "이메일",
    "탑승일시",
    "출발지 위치명",
    "도착지 위치명",
    "전달사항(유/무)",
  ];
  const headerWidths = [5, 1, 10, 20, 20, 10, 5, 5, 10, 10, 1];
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
              {IamwebUtils.getStatusString(d.status)}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.id}
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
            <StyledTableCell component='th' scope='row'>
              {d.user.company}/{d.user.name}/{d.user.position}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.user.phone}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.user.email}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.boarding_date} {d.boarding_time}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.startLocation === "" ? d.startAirport : d.startLocation}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.goalLocation === "" ? d.goalAirport : d.goalLocation}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              보기
            </StyledTableCell>
          </StyledTableRow>
        );
      })
    );
  };

  return (
    <>
      <div className='p-5 bg-gray-500'>
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
