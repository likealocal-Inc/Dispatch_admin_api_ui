import {
  Backdrop,
  Box,
  Button,
  Card,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import useCallAPI from "../../../libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "../../../libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { getElementById } from "../../../libs/client/utils/html";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { DispatchModel } from "@libs/client/models/dispatch.model";
import { UserModel } from "@libs/client/models/user.model";

import {
  BoardingDateComponent,
  InfomationComponent,
  LocationAndAddress,
  MyDaumPostcode,
  UserInfomation,
  orderTypeList,
} from "./utils";
import {
  EnumDispatchStatus,
  DispatchUtils,
} from "@libs/client/utils/dispatch.utils";

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
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const [selectType, setSelectType] = useState(orderTypeList[0]);

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
      orderTypeList[0],
      "startLocation",
      startAddress
    );
    const goalInfo = getAddress(
      selectType,
      orderTypeList[1],
      "goalLocation",
      goalAddress
    );

    let information = getElementById<HTMLInputElement>("infomation").value;

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

  const onStatusUpdate = () => {
    callAPI({
      urlInfo: APIURLs.DISPATCH_STATUS_UPDATE,
      addUrlParams: `/${dispatch!.id}/${EnumDispatchStatus.DISPATCH_ING}`,
    })
      .then((d) => d.json())
      .then((d) => {
        if (d.ok === true) {
          location.reload();
        }
      });
  };

  const closeAddressModal = () => {
    setIsStartAddressSearchShow(false);
    setIsGoalAddressSearchShow(false);
  };

  const onStartAddress = (data: any) => {
    closeAddressModal();
    setStartAddress(data.address);
  };

  const onGoalAddress = (data: any) => {
    closeAddressModal();
    setGoalAddress(data.address);
  };

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
                    className='flex flex-row items-center justify-center p-2 font-bold text-center text-gray-800'
                    onClick={closeAddressModal}
                  >
                    <div className='pr-10'>
                      배차요청 {isModify ? "수정" : "생성"}
                    </div>

                    {dispatch?.isIamweb &&
                    dispatch.status ===
                      EnumDispatchStatus.IAMWEB_ORDER.toString() ? (
                      <Button
                        variant='contained'
                        className='mr-2 font-bold text-black bg-green-500 w-44'
                        onClick={onStatusUpdate}
                      >
                        배차요청
                      </Button>
                    ) : (
                      DispatchUtils.getStatusString(dispatch!.status)
                    )}
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
                              {orderTypeList.map((d, k) => (
                                <option
                                  key={k}
                                  value={d}
                                  selected={
                                    isModify && d === dispatch!.orderTitle
                                      ? true
                                      : false
                                  }
                                >
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                          <UserInfomation me={me} />
                        </div>
                        <div className='flex flex-col pl-5'>
                          <BoardingDateComponent
                            startDate={startDate}
                            setStartDate={setStartDate}
                          />
                          <LocationAndAddress
                            title={"출발지"}
                            selectType={selectType}
                            orderType={orderTypeList[0]}
                            isModify={isModify}
                            address={startAddress}
                            setIsAddressSearchShow={setIsStartAddressSearchShow}
                            locationStr={"startLocation"}
                            locationObj={dispatch?.startLocation}
                          />

                          <LocationAndAddress
                            title={"도착지"}
                            selectType={selectType}
                            orderType={orderTypeList[1]}
                            isModify={isModify}
                            address={goalAddress}
                            setIsAddressSearchShow={setIsGoalAddressSearchShow}
                            locationStr={"goalLocation"}
                            locationObj={dispatch?.goalLocation}
                          />
                        </div>
                      </div>
                      <InfomationComponent
                        isModify={isModify}
                        information={dispatch?.information}
                        isIamweb={dispatch?.isIamweb}
                      />
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
                  <MyDaumPostcode
                    isDisplay={isStartAddressSearchShow}
                    onComplete={onStartAddress}
                  />
                  <MyDaumPostcode
                    isDisplay={isGoalAddressSearchShow}
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
