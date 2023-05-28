import { useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { MessageProps } from "@components/MessageShow/show";
import Button02 from "@components/buttons/Button02";
import TableTemplate from "@components/ListTable/TableTemplate";
import { jsonToString } from "@libs/utils";
import { DateUtils } from "@libs/date.utils";
import { DispatchUtils } from "@libs/client/utils/dispatch.utils";
import ModalOrderIamwebModify from "@components/Modals/ModalOrderIamwebModify";
import { DispatchModel } from "@libs/client/models/dispatch.model";
import { callAPI } from "@libs/client/call/call";
import ManageDispatchModal from "./manageDispatch";

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

  const [isModify, setIsModify] = useState(true);

  const [selectDispatch, setSelectDispatch] = useState<DispatchModel>();

  // 모달 관련 설정
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleModalClose = (isChange: boolean = false) => {
    setOpenModal(false);
    if (isChange) setReload(reload + 1);
  };

  const onCreateOpen = () => {
    setIsModify(false);
    setOpenModal(true);
  };
  const onModifyOpen = (dispatch: DispatchModel) => {
    setIsModify(true);
    setOpenModal(true);
    setSelectDispatch(dispatch);
  };

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
    "전달사항",
  ];

  const headerWidths = [5, 1, 12, 15, 10, 8, 5, 10, 10, 10, 3];

  const body = (res: DispatchModel[]) => {
    return (
      res &&
      res.map((d, key) => {
        return (
          <StyledTableRow
            key={key}
            className='transition duration-300 ease-in-out border-b hover:bg-gray-300'
            onDoubleClick={() => onModifyOpen(d)}
          >
            <StyledTableCell component='th' scope='row'>
              {DispatchUtils.getStatusString(d.status)}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.id}
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: DateUtils.stringToDate(d.orderTime),
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='text-xs'>{d.orderTitle}</div>
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
            <StyledTableCell
              component='th'
              scope='row'
              dangerouslySetInnerHTML={{
                __html: `${d.boardingDate}`,
              }}
            ></StyledTableCell>
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
          listCallUrl={APIURLs.DISPATCH_LIST}
          reload={reload}
          message={message!}
          setMessage={setMessage}
          onCreate={onCreateOpen}
        />

        {openModal ? (
          <ManageDispatchModal
            isModify={isModify}
            open={openModal}
            handleModalClose={handleModalClose}
            dispatch={selectDispatch}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
