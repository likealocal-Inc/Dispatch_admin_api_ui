import AdminLayout from "@components/layouts/AdminLayout";
import { callAPI } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
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
import { useEffect, useState } from "react";

export default function Profile() {
  const [update, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.USER_UPDATE,
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    callAPI({ urlInfo: APIURLs.ME }).then((d) => {
      const user = d.json().then((d) => {
        console.log(d.data);
        setUser(d.data);
      });
    });
  }, []);

  console.log(">>", user);
  useEffect(() => {
    if (!loading) {
      if (data?.ok === false) {
        setMessage(data?.data.description.codeMessage);
      } else if (data?.ok === true) {
        location.reload();
      }
    }
  }, [loading]);

  return (
    <>
      <AdminLayout menuTitle='goodman'>
        <div className='flex flex-wrap'>
          <Box sx={style}>
            <Typography id='transition-modal-title' variant='h6' component='h2'>
              <div className='text-center'>사용자 정보 수정</div>
            </Typography>
            {loading && <div>Loading...</div>}
            <div>
              <Stack>
                <Card className='p-5'>
                  <TextField
                    id='m-email'
                    label='이메일'
                    value={user ? user!.email : ""}
                    className='py-3'
                    InputProps={{
                      readOnly: true,
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

                      <div className='flex justify-center pb-6 text-sm text-red-500'>
                        패스워드는 입력안하면 저장안됨
                      </div>
                    </div>
                  )}
                  <TextField
                    id='m-phone'
                    label='전화번호'
                    value={user ? user!.phone : ""}
                    className='py-3'
                  />
                  <TextField
                    id='m-company'
                    label='회사'
                    value={user ? user!.company : ""}
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
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant='contained'
                    className='w-full'
                    onClick={() => {}}
                  >
                    저장
                  </Button>
                </div>
              </Stack>
            </div>
          </Box>
        </div>
      </AdminLayout>
    </>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "20%",
  transform: "translate(10%, 10%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
