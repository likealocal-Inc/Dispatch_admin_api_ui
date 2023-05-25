import { UserModel } from "@libs/client/models/user.model";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useCallAPI from "../../../libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "../../../libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { getElementById } from "../../../libs/client/utils/html";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { CompanyModel } from "@libs/client/models/company.model";

interface ModalProps {
  isModify: boolean;
  user?: UserModel;
  open: boolean;
  handleModalClose: Function;
}

export default function ManageUserModal({
  open,
  user,
  handleModalClose,
  isModify,
}: ModalProps) {
  const [isFirst, setIsFirst] = useState(true);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: isModify && open ? APIURLs.USER_UPDATE : APIURLs.JOIN,
    addUrlParams: isModify && open ? `/${user!.id}` : "",
  });

  const [message, setMessage] = useState("");

  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);

  useEffect(() => {
    if (!loading && !isFirst) {
      if (data?.ok === false) {
        setMessage(data?.data.description.codeMessage);
      } else if (data?.ok === true) {
        handleModalClose(true);
        location.reload();
      }
    }
    if (isFirst) {
      setIsFirst(false);
    }
  }, [loading]);

  useEffect(() => {
    callAPI({
      urlInfo: APIURLs.COMPANY_LIST,
      params: { size: 99999, page: 0 },
    }).then(async (d) => {
      const data = await d.json();
      setCompanyList(data.data.data);
    });
  }, []);

  const onSubmit = () => {
    const phone = getElementById<HTMLInputElement>("m-phone").value;
    const companyObj = getElementById<HTMLSelectElement>("m-company");
    const company = companyObj.options[companyObj.selectedIndex].value;

    const password = getElementById<HTMLInputElement>("m-password").value;
    const email = getElementById<HTMLInputElement>("m-email").value;
    const position = getElementById<HTMLInputElement>("m-position").value;
    const name = getElementById<HTMLInputElement>("m-name").value;

    call({ phone, company, password, email, position, name });
  };

  return (
    <>
      {open && (
        <Modal
          className='bg-gray-700 bg-opacity-80'
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className=''>
              <Box sx={style} className='w-1/5 bg-slate-100'>
                <Typography
                  id='transition-modal-title'
                  variant='h6'
                  component='h2'
                >
                  <div className='p-2 text-center text-gray-800'>
                    사용자 정보 {isModify ? "수정" : "생성"}
                  </div>
                </Typography>
                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack>
                    <Card className='p-6'>
                      <div className=''>
                        <TextField
                          id='m-email'
                          label='이메일'
                          defaultValue={isModify ? user!.email : ""}
                          className='w-full py-3'
                          InputProps={{
                            readOnly: isModify ? true : false,
                          }}
                        />
                      </div>
                      {true && (
                        <div className=''>
                          <TextField
                            id='m-password'
                            label='패스워드'
                            type='password'
                            className='w-full py-3'
                          />
                          {isModify ?? (
                            <div className='flex justify-center pb-6 text-sm text-red-500'>
                              패스워드는 입력안하면 저장안됨
                            </div>
                          )}
                        </div>
                      )}
                      <TextField
                        id='m-phone'
                        label='전화번호'
                        defaultValue={isModify ? user!.phone : ""}
                        className='w-full py-3'
                      />
                      <select
                        className='w-full px-3 py-3 text-sm duration-150 bg-white rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                        id='m-company'
                        required={true}
                      >
                        {companyList.length > 0 &&
                          companyList.map((d, key) => {
                            console.log(user);
                            return (
                              <option
                                key={d.id}
                                defaultValue={d.name}
                                selected={
                                  isModify
                                    ? d.name === user!.company
                                      ? true
                                      : false
                                    : false
                                }
                              >
                                {d.name}
                              </option>
                            );
                          })}
                      </select>
                      <div
                        className={
                          message === ""
                            ? "hidden "
                            : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 "
                        }
                      >
                        {message}
                      </div>
                      <TextField
                        id='m-position'
                        label='직급'
                        defaultValue={isModify ? user!.position : ""}
                        className='w-full py-3'
                      />
                      <TextField
                        id='m-name'
                        label='이름'
                        defaultValue={isModify ? user!.name : ""}
                        className='w-full py-3'
                      />
                    </Card>
                    <div className='flex justify-end px-4 mt-2'>
                      <Button
                        variant='contained'
                        className='w-full mr-2 bg-gray-700'
                        onClick={() => {
                          setMessage("");
                          handleModalClose();
                        }}
                      >
                        취소
                      </Button>
                      <Button
                        variant='contained'
                        className='w-full bg-gray-700'
                        onClick={() => {
                          onSubmit();
                        }}
                      >
                        저장
                      </Button>
                    </div>
                  </Stack>
                </div>
              </Box>
            </div>
          </Fade>
        </Modal>
      )}
    </>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
