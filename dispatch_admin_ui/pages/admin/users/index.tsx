import { useEffect, useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user_model";
import { getElementById } from "@libs/client/utils/html";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { callAPI } from "@libs/client/call/call";
import { MessageProps } from "@components/MessageShow/show";
import ManageUserModal from "./manageUser";
import TableTemplate from "@components/ListTable/TableTemplate";
import Button02 from "@components/buttons/Button02";

export default function Users() {
  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();

  // 화면 재로딩
  const [reload, setReload] = useState(0);

  // 모달 관련 설정
  const [isModify, setIsModify] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectUser, setSelectUser] = useState<UserModel>();

  const handleModalOpen = (user: UserModel) => {
    setSelectUser(user);
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
    "Email",
    "company",
    "phone",
    "생성일",
    "수정일",
    "권한",
    "활성화",
    "삭제",
  ];
  const headerWidths = [3, 60, 30, 40, 30, 30, 10, 10, 30];
  const body = (res: UserModel[]) => {
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
              {d.email}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.company}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.phone}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.created.toString()}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.updated.toString()}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              {d.role}
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  id={"i--" + d.id.toString()}
                  type='checkbox'
                  value=''
                  className='sr-only peer'
                  {...(d.isActive ? { checked: true } : { checked: false })}
                  onChange={(e) => {
                    callAPI({
                      urlInfo: {
                        url: `${APIURLs.USER_UPDATE.url}/${
                          d.id
                        }/${!d.isActive}`,
                        method: APIURLs.USER_UPDATE.method,
                        desc: APIURLs.USER_UPDATE.desc,
                      },
                    }).then((res) => {
                      d.isActive = !d.isActive;
                      if (d.isActive) {
                        getElementById<HTMLInputElement>(
                          "i--" + d.id.toString()
                        ).checked = true;
                      } else {
                        getElementById<HTMLInputElement>(
                          "i--" + d.id.toString()
                        ).checked = false;
                      }

                      setMessage({
                        message: `사용자 활성화: UserID:[${d.id}] ${
                          d.isActive ? "활성화" : "비활성화"
                        }`,
                        type: "S",
                      });
                    });
                  }}
                />
                <div className="w-11 h-6  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600" />
              </label>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <Button02
                label={"삭제"}
                onClick={() => {
                  callAPI({
                    urlInfo: {
                      url: `${APIURLs.USER_DELETE.url}/${d.id}`,
                      method: APIURLs.USER_DELETE.method,
                      desc: APIURLs.USER_DELETE.desc,
                    },
                  }).then((res) => {
                    location.reload();
                  });
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
          title='사용자 관리'
          headers={headers}
          headerWidths={headerWidths}
          body={body}
          listCallUrl={APIURLs.USER_LIST}
          reload={reload}
          message={message!}
          setMessage={setMessage}
          onCreate={handleCreateModalOpen}
        />

        <ManageUserModal
          isModify={isModify}
          open={openModal}
          user={selectUser}
          handleModalClose={handleModalClose}
        />
      </div>
    </>
  );
}
