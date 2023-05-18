import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

import AdminLayout from "@components/layouts/AdminLayout";
import useCallAPI from "@libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user_model";
import { getElementById } from "@libs/client/utils/html";
import PaginavigationWidget from "@components/ListTable/Paginavigation";
import TableHeader from "@components/ListTable/TableHeader";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { callAPI } from "@libs/client/call/call";
import { MessageProps, MessageShow } from "@components/MessageShow/show";
import ManageUserModal from "./manageUser";

export default function Users() {
  const size = 10;
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [message, setMessage] = useState<MessageProps>();

  const [open, setOpen] = useState(false);

  const [selectUser, setSelectUser] = useState<UserModel>();
  const handleModalOpen = (user: UserModel) => {
    setOpen(true);
    setSelectUser(user);
  };

  const [res, setRes] = useState<UserModel[]>([]);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.LIST_USER,
  });

  const handleModalClose = (isChange: boolean = false) => {
    setOpen(false);
    if (isChange) pageReload();
  };

  /**
   * 데이터 변경이 있을경우 현재 페이지 재로딩
   */
  const pageReload = () => {
    call({
      size,
      page,
      where: {
        role: "USER",
      },
    });
  };
  useEffect(() => {
    pageReload();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      if (data?.ok) {
        setRes(data.data.list);
        setTotalCount(data.data.count);
      }
    }
  }, [data, loading]);

  const headers = [
    "ID",
    "Email",
    "Name",
    "Nicname",
    "Phone",
    "profile",
    "생성일",
    "수정일",
    "활성화",
  ];
  const headerWidth = [3, 60, 30, 30, 40, 30, 50, 50, 30];
  return (
    <>
      {loading && (
        <div className='absolute flex flex-col items-center justify-center w-screen h-screen my-auto '>
          <ReactLoading
            type='spin'
            color='red'
            width={200}
            height={200}
          ></ReactLoading>
        </div>
      )}
      <AdminLayout menuTitle='사용자 관리'>
        <div className=''>
          <div className='flex flex-col'>
            <TableContainer component={Paper}>
              <Table aria-label='customized table'>
                <TableHeader headers={headers} headerWidth={headerWidth} />
                <TableBody>
                  {res &&
                    res.map((d, key) => {
                      return (
                        <StyledTableRow
                          key={key}
                          className='transition duration-300 ease-in-out border-b hover:bg-gray-300'
                          // onDoubleClick={() => {
                          //   getElementById<HTMLDialogElement>(
                          //     "exampleModalCenteredScrollable"
                          //   ).show();
                          // }}
                        >
                          <StyledTableCell component='th' scope='row'>
                            <button
                              onClick={() => {
                                handleModalOpen(d);
                              }}
                              type='button'
                              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                            >
                              {d.id}
                            </button>
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.email}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.name}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.nickName}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.phone}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.profileImgId}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.created.toString()}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            {d.updated.toString()}
                          </StyledTableCell>
                          <StyledTableCell component='th' scope='row'>
                            <label className='relative inline-flex items-center cursor-pointer'>
                              <input
                                id={"i--" + d.id.toString()}
                                type='checkbox'
                                value=''
                                className='sr-only peer'
                                {...(d.isActive
                                  ? { checked: true }
                                  : { checked: false })}
                                onChange={(e) => {
                                  callAPI({
                                    urlInfo: {
                                      url: `${APIURLs.UPDATE_USER_ACTIVE.url}/${
                                        d.id
                                      }/${!d.isActive}`,
                                      method: APIURLs.UPDATE_USER_ACTIVE.method,
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
                                      message: `사용자 활성화: UserID:[${
                                        d.id
                                      }] ${d.isActive ? "활성화" : "비활성화"}`,
                                      type: "S",
                                    });
                                  });
                                }}
                              />
                              <div className="w-11 h-6  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600" />
                            </label>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 페이지처리 */}
            <PaginavigationWidget
              page={page}
              setPage={setPage}
              call={call}
              size={size}
              totalCount={totalCount}
            />
          </div>
        </div>
      </AdminLayout>

      {/* 메세지 */}
      <MessageShow setMessage={setMessage} message={message} />

      {selectUser && (
        <ManageUserModal
          open={open}
          user={selectUser}
          handleModalClose={handleModalClose}
        />
      )}
    </>
  );
}
