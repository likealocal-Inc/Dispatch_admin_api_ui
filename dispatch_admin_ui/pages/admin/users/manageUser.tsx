import { UserModel } from "@libs/client/models/user_model";
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

  const onSubmit = () => {
    const phone = getElementById<HTMLInputElement>("m-phone").value;
    const company = getElementById<HTMLInputElement>("m-company").value;
    const password = getElementById<HTMLInputElement>("m-password").value;
    const email = getElementById<HTMLInputElement>("m-email").value;

    call({ phone, company, password, email });
  };

  return (
    <>
      {open && (
        <Modal
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
            <Box sx={style}>
              <Typography
                id='transition-modal-title'
                variant='h6'
                component='h2'
              >
                <div className='text-center'>
                  사용자 정보 {isModify ? "수정" : "생성"}
                </div>
              </Typography>
              {loading && <div>Loading...</div>}
              <div>
                <Stack>
                  <Card className='p-5'>
                    <TextField
                      id='m-email'
                      label='이메일'
                      defaultValue={isModify ? user!.email : ""}
                      className='py-3'
                      InputProps={{
                        readOnly: isModify ? true : false,
                      }}
                    />
                    {true && (
                      <div className=''>
                        <TextField
                          id='m-password'
                          label='패스워드'
                          type='password'
                          className='py-1'
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
                      className='py-3'
                    />
                    <TextField
                      id='m-company'
                      label='회사'
                      defaultValue={isModify ? user!.company : ""}
                      className='py-3'
                    />
                    <div
                      className={
                        message === ""
                          ? "hidden "
                          : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 "
                      }
                    >
                      {message}
                    </div>
                  </Card>
                  <div className='flex justify-end px-4 mt-2'>
                    <Button
                      variant='contained'
                      className='w-full mr-2'
                      onClick={() => {
                        setMessage("");
                        handleModalClose();
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      variant='contained'
                      className='w-full'
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
