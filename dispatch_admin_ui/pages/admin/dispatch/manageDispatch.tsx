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
  const airportList = ["인천1공항", "인천2공항", "김포공항"];
  const airportSelect = (id: string, isSelect?: string) => (
    <>
      <select className='w-full m-3 rounded-lg' id={id}>
        {airportList.map((d, k) => (
          <option key={k} value={d} selected={isSelect === d ? true : false}>
            {d}
          </option>
        ))}
        {/* <option value='인천1공항'>인천1공항</option>
        <option value='인천2공항'>인천2공항</option>
        <option value='김포공항'>김포공항</option> */}
      </select>
    </>
  );
  const [isFirst, setIsFirst] = useState(true);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: isModify && open ? APIURLs.DISPATCH_UPDATE : APIURLs.DISPATCH_CREATE,
    addUrlParams: isModify && open ? `/${dispatch!.id}` : "",
  });

  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const typeList = ["공항픽업", "공항샌딩", "시간대절"];
  const [selectType, setSelectType] = useState(typeList[0]);

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

  const getAddress = (
    nowType: string,
    compareType: string,
    idValue: string,
    addressDAta: string
  ) => {
    let location;
    let address;
    if (nowType === compareType) {
      const locationObj = getElementById<HTMLSelectElement>(idValue);
      location = locationObj.options[locationObj.selectedIndex].value;
      address = nowType;
    } else {
      location = getElementById<HTMLInputElement>(idValue).value;
      address = addressDAta;
    }
    return { location, address };
  };

  useEffect(() => {
    if (isModify === false) {
      const me = callAPI({ urlInfo: APIURLs.ME }).then((d) => d.json());
      me.then((d) => setMe(d.data));
    } else {
      const user = callAPI({
        urlInfo: APIURLs.USER_BY_ID,
        addUrlParams: `/${dispatch?.userId}`,
      }).then((d) => d.json());
      user.then((d) => {
        setMe(d.data);
        setStartDate(new Date(dispatch!.boardingDate));
        setSelectType(dispatch!.orderTitle);
        setStartAddress(dispatch!.startAddress);
        setGoalAddress(dispatch!.goalAddress);
      });
    }
  }, [open]);

  const onSubmit = () => {
    const titleObj = getElementById<HTMLSelectElement>("orderTitle");
    const orderTitle = titleObj.options[titleObj.selectedIndex].value;

    const boardingDate = startDate;

    const startInfo = getAddress(
      selectType,
      typeList[0],
      "startLocation",
      startAddress
    );
    const goalInfo = getAddress(
      selectType,
      typeList[1],
      "goalLocation",
      goalAddress
    );

    const information = getElementById<HTMLInputElement>("infomation").value;

    if (
      orderTitle === "" ||
      boardingDate === null ||
      startInfo.location === "" ||
      goalInfo.location === "" ||
      startInfo.address === "" ||
      goalInfo.address === "" ||
      information === ""
    ) {
      setMessage("모든 데이터를 입력해주세요");
    } else {
      call({
        orderTitle,
        boardingDate,
        startLocation: startInfo.location,
        startAddress: startInfo.address,
        goalLocation: goalInfo.location,
        goalAddress: goalInfo.address,
        information,
        else01: "",
        else02: "",
      });
    }
  };

  const closeAddressModal = () => {
    setIsStartAddressSearchShow(false);
    setIsGoalAddressSearchShow(false);
  };

  const onStartAddress = (data: any) => {
    closeAddressModal();
    setStartAddress(data.address);
  }; // onCompletePost 함수

  const onGoalAddress = (data: any) => {
    closeAddressModal();
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
              <Box sx={style} className='bg-slate-100'>
                <Typography
                  id='transition-modal-title'
                  variant='h6'
                  component='h2'
                >
                  <div
                    className='p-2 font-bold text-center text-gray-800'
                    onClick={closeAddressModal}
                  >
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
                              onChange={(v) => {
                                setSelectType(v.target.value);
                              }}
                            >
                              {typeList.map((d, k) => (
                                <option
                                  key={k}
                                  value={d}
                                  selected={
                                    isModify
                                      ? d === dispatch!.orderTitle
                                        ? true
                                        : false
                                      : false
                                  }
                                >
                                  {d}
                                </option>
                              ))}
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
                                timeIntervals={5}
                                timeCaption='time'
                                dateFormat='yyyy/MM/dd h:mm aa'
                              />
                            </div>
                          </div>

                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>출발지명</div>
                            {selectType === typeList[0] ? (
                              <>
                                {isModify
                                  ? airportSelect(
                                      "startLocation",
                                      dispatch?.startLocation
                                    )
                                  : airportSelect("startLocation")}
                                {/* <select
                                  className='w-full m-3 rounded-lg'
                                  id='startLocation'
                                >
                                  <option value='인천1공항'>인천1공항</option>
                                  <option value='인천2공항'>인천2공항</option>
                                  <option value='김포공항'>김포공항</option>
                                </select> */}
                              </>
                            ) : (
                              <div className='w-full m-3'>
                                <TextField
                                  id='startLocation'
                                  defaultValue={
                                    isModify ? dispatch?.startLocation : ""
                                  }
                                  className='w-full'
                                />
                              </div>
                            )}
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>출발지주소</div>
                            <div className='w-full m-3'>
                              {selectType === typeList[0] ? (
                                <>
                                  <TextField
                                    id='myStartAddress'
                                    value={selectType}
                                    className='w-full bg-slate-300'
                                    disabled
                                  />
                                </>
                              ) : (
                                <TextField
                                  id='myStartAddress'
                                  value={startAddress}
                                  className='w-full'
                                  onClick={() => {
                                    setIsStartAddressSearchShow(true);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>도착지명</div>
                            {selectType === typeList[1] ? (
                              <>
                                {isModify
                                  ? airportSelect(
                                      "goalLocation",
                                      dispatch?.goalLocation
                                    )
                                  : airportSelect("goalLocation")}
                                {/* <select
                                  className='w-full m-3 rounded-lg'
                                  id='goalLocation'
                                >
                                  <option value='인천1공항'>인천1공항</option>
                                  <option value='인천2공항'>인천2공항</option>
                                  <option value='김포공항'>김포공항</option>
                                </select> */}
                              </>
                            ) : (
                              <div className='w-full m-3'>
                                <TextField
                                  id='goalLocation'
                                  defaultValue={
                                    isModify ? dispatch?.goalLocation : ""
                                  }
                                  className='w-full'
                                />
                              </div>
                            )}
                          </div>
                          <div className='flex flex-row items-center w-72'>
                            <div className='w-28'>도착지주소</div>
                            <div className='w-full m-3'>
                              {selectType === typeList[1] ? (
                                <>
                                  <TextField
                                    id='myGoalAddress'
                                    value={selectType}
                                    className='w-full bg-slate-300'
                                    disabled
                                  />
                                </>
                              ) : (
                                <TextField
                                  id='myGoalAddress'
                                  value={goalAddress}
                                  className='w-full'
                                  onClick={() => {
                                    setIsGoalAddressSearchShow(true);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-row items-center w-full'>
                        <div className='w-28'>전달사항</div>
                        <div className='w-full m-3'>
                          <TextField
                            id='infomation'
                            defaultValue={isModify ? dispatch?.information : ""}
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
