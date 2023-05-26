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
import { use, useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { DispatchModel } from "@libs/client/models/dispatch.model";

// https://reactdatepicker.com/#example-custom-time-input
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DaumPostcode from "react-daum-postcode";

interface ModalProps {
  isModify: boolean;
  dispatch?: DispatchModel;
  open: boolean;
  handleModalClose: Function;
}

export default function ManageDispatchModal({
  open,
  dispatch,
  handleModalClose,
  isModify,
}: ModalProps) {
  const [isFirst, setIsFirst] = useState(true);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: isModify && open ? APIURLs.DISPATCH_UPDATE : APIURLs.DISPATCH_CREATE,
    addUrlParams: isModify && open ? `/${dispatch!.id}` : "",
  });

  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const [me, setMe] = useState<UserModel>();

  // 주소관련
  const [isStartAddressSearchShow, setIsStartAddressSearchShow] =
    useState(false);
  const [isGoalAddressSearchShow, setIsGoalAddressSearchShow] = useState(false);
  const [startAddress, setStartAddress] = useState("");
  const [goalAddress, setGoalAddress] = useState("");

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
    const me = callAPI({ urlInfo: APIURLs.ME }).then((d) => d.json());
    me.then((d) => setMe(d.data));
  }, []);

  const onSubmit = () => {
    const titleObj = getElementById<HTMLSelectElement>("orderTitle");
    const orderTitle = titleObj.options[titleObj.selectedIndex].value;

    const boardingDate = startDate;

    const startLocation =
      getElementById<HTMLInputElement>("startLocation").value;
    const goalLocation = getElementById<HTMLInputElement>("goalLocation").value;

    const myStartAddress = startAddress;
    const myGoalAddress = goalAddress;

    const information = getElementById<HTMLInputElement>("infomation").value;

    if (
      orderTitle === "" ||
      boardingDate === null ||
      startLocation === "" ||
      goalLocation === "" ||
      goalAddress === "" ||
      information === ""
    ) {
      setMessage("모든 데이터를 입력해주세요");
    } else {
      call({
        orderTitle,
        boardingDate,
        startLocation,
        startAddress,
        goalLocation,
        goalAddress,
        information,
        else01: "",
        else02: "",
      });
    }
  };

  const onStartAddress = (data: any) => {
    setIsStartAddressSearchShow(false);
    setStartAddress(data.address);
  }; // onCompletePost 함수

  const onGoalAddress = (data: any) => {
    setIsGoalAddressSearchShow(false);
    setGoalAddress(data.address);
  }; // onCompletePost 함수

  // 스타일 정의 code

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
              <Box sx={style} className='w- bg-slate-100'>
                <Typography
                  id='transition-modal-title'
                  variant='h6'
                  component='h2'
                >
                  <div className='p-2 font-bold text-center text-gray-800'>
                    배차요청 {isModify ? "수정" : "생성"}
                  </div>
                </Typography>
                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack>
                    <Card className='p-6'>
                      <div className='flex flex-row'>
                        <div className='flex flex-col p-3'>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>상품구분</div>
                            <select
                              className='w-full m-3 rounded-lg'
                              id='orderTitle'
                            >
                              <option value='공항픽업'>공항픽업</option>
                              <option value='공항샌딩'>공항샌딩</option>
                              <option value='시간대절'>시간대절</option>
                            </select>
                          </div>
                          <div className='flex flex-row items-center my-1 w-72'>
                            <div className='w-28'>소속</div>
                            <div className='flex items-center justify-center w-full h-full m-3 rounded-lg bg-slate-300'>
                              <div className=''>{me?.company}</div>
                            </div>
                          </div>

                          <div className='flex flex-row items-center my-1 w-72'>
                            <div className='w-28'>직급</div>
                            <div className='flex items-center justify-center w-full h-full m-3 rounded-lg bg-slate-300'>
                              <div className=''>{me?.position}</div>
                            </div>
                          </div>

                          <div className='flex flex-row items-center my-1 w-72'>
                            <div className='w-28'>이름</div>
                            <div className='flex items-center justify-center w-full h-full m-3 rounded-lg bg-slate-300'>
                              <div className=''>{me?.name}</div>
                            </div>
                          </div>

                          <div className='flex flex-row items-center my-1 w-72'>
                            <div className='w-28'>번호</div>
                            <div className='flex items-center justify-center w-full h-full m-3 rounded-lg bg-slate-300'>
                              <div className=''>{me?.phone}</div>
                            </div>
                          </div>

                          <div className='flex flex-row items-center my-1 w-72'>
                            <div className='w-28'>이메일</div>
                            <div className='flex items-center justify-center w-full h-full m-3 rounded-lg bg-slate-300'>
                              <div className=''>{me?.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className='flex flex-col pl-5'>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>탑승일시</div>
                            <div className='w-full m-3'>
                              <DatePicker
                                className='rounded-lg'
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                showTimeSelect
                                timeFormat='HH:mm'
                                timeIntervals={15}
                                timeCaption='time'
                                dateFormat='yyyy/MM/dd h:mm aa'
                              />
                            </div>
                          </div>
                          {/* <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>탑승시간</div>
                            <div className='w-full m-3'>
                              <DatePicker
                                className='rounded-lg'
                                selected={startDate}
                                onChange={(date: any) => setStartTime(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption='Time'
                                dateFormat='h:mm aa'
                              />
                            </div>
                          </div> */}
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>출발지명</div>
                            <div className='w-full m-3'>
                              <TextField
                                id='startLocation'
                                defaultValue={""}
                                className='w-full'
                              />
                            </div>
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>출발지주소</div>
                            <div className='w-full m-3'>
                              <TextField
                                id='startAddress'
                                value={startAddress}
                                className='w-full'
                                onClick={() => {
                                  setIsStartAddressSearchShow(true);
                                }}
                              />
                            </div>
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>도착지명</div>
                            <div className='w-full m-3'>
                              <TextField
                                id='goalLocation'
                                defaultValue={""}
                                className='w-full'
                              />
                            </div>
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>도착지주소</div>
                            <div className='w-full m-3'>
                              <TextField
                                id='goalAddress'
                                value={goalAddress}
                                className='w-full'
                                onClick={() => {
                                  setIsGoalAddressSearchShow(true);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row items-center w-full'>
                        <div className='w-28'>전달사항</div>
                        <div className='w-full m-3'>
                          <TextField
                            id='infomation'
                            defaultValue={""}
                            className='w-full'
                            multiline
                            rows={5}
                          />
                        </div>
                      </div>
                    </Card>
                    <div
                      className={
                        message === ""
                          ? "hidden "
                          : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 "
                      }
                    >
                      {message}
                    </div>
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
                  <DaumPostcode
                    style={{
                      position: "absolute",
                      top: "48%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "650px",
                      height: "500px",
                      border: "2px solid #000",
                      boxShadow: "24",
                      display: isStartAddressSearchShow ? "block" : "none",
                    }}
                    onComplete={onStartAddress}
                  />
                  <DaumPostcode
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "600px",
                      height: "500px",
                      border: "2px solid #000",
                      boxShadow: "24",
                      display: isGoalAddressSearchShow ? "block" : "none",
                    }}
                    onComplete={onGoalAddress}
                  />
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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
