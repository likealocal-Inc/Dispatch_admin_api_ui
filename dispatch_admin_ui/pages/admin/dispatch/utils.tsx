import { TextField } from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { UIType } from "./manageDispatch";
import "react-datepicker/dist/react-datepicker.css";

const airportList = ["인천1공항", "인천2공항", "김포공항"];
export const airportSelectTag = (id: string, isSelect?: string) => {
  return (
    <>
      <select className='w-full m-3 rounded-lg' id={id}>
        {airportList.map((d, k) => (
          <option key={k} value={d} selected={isSelect === d ? true : false}>
            {d}
          </option>
        ))}
      </select>
    </>
  );
};

export function InfoBox({ info }: any) {
  return (
    <div className='flex items-center justify-center w-full h-full m-2 rounded-lg bg-slate-300'>
      <div className='text-sm'>{info}</div>
    </div>
  );
}
export function InfoBoxWithTitle({ title, info }: any) {
  return (
    <div className='flex flex-row items-center my-1'>
      <div className='text-sm w-28'>{title}</div>
      <InfoBox info={info} />
    </div>
  );
}

export const orderTypeList = ["공항픽업", "공항샌딩", "시간대절"];

// 사용자 정보 출력 컴포넌트
export function UserInfomation({ me }: any) {
  return (
    <>
      <InfoBoxWithTitle title='소속' info={me?.company} />
      <InfoBoxWithTitle title='직급' info={me?.position} />
      <InfoBoxWithTitle title='이름' info={me?.name} />
      <InfoBoxWithTitle title='번호' info={me?.phone} />
      <InfoBoxWithTitle title='이메일' info={me?.email} />
    </>
  );
}

// 다음 주소
export function MyDaumPostcode({ isDisplay, onComplete }: any) {
  return (
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
        display: isDisplay ? "block" : "none",
      }}
      onComplete={onComplete}
    />
  );
}

export function LocationAndAddress({
  title,
  selectType,
  orderType,
  uiType,
  address,
  setIsAddressSearchShow,
  locationStr,
  locationObj,
}: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>{title}명</div>
        {selectType === orderType ? (
          <>
            {uiType === UIType.MODIFY
              ? airportSelectTag(locationStr, locationObj)
              : airportSelectTag(locationStr)}
          </>
        ) : (
          <div className='w-full m-1'>
            <TextField
              id={locationStr}
              defaultValue={uiType === UIType.MODIFY ? locationObj : ""}
              className='w-full'
            />
          </div>
        )}
      </div>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>{title}주소</div>
        <div className='w-full m-1'>
          {selectType === orderType ? (
            <>
              <TextField
                value={selectType}
                className='w-full text-sm bg-slate-300'
                disabled
              />
            </>
          ) : (
            <TextField
              value={address}
              className='w-full text-sm'
              onClick={() => {
                setIsAddressSearchShow(true);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export function InfomationComponent({ uiType, information, isIamweb }: any) {
  const [infoData, setInfoData] = useState<any>();

  let infos: any;

  if (uiType === UIType.MODIFY || uiType === UIType.DISPATCH) {
    if (isIamweb) {
      infos = JSON.parse(information);
    } else {
      infos = information;
    }
  }

  useEffect(() => {
    setInfoData(information);
  }, []);
  useEffect(() => {}, [infoData, setInfoData]);
  return (
    <>
      <div className='flex flex-row items-center w-full'>
        <div className='text-sm w-28'>전달사항</div>
        <div className='w-full p-2 border-2'>
          {isIamweb === true && infos !== undefined ? (
            <>
              {Object.keys(infos).map((d) => {
                return (
                  <div key={d} className='flex flex-row justify-between'>
                    <div className='p-2 m-1 text-sm rounded-lg w-96 bg-slate-200'>
                      {d}
                    </div>
                    {uiType === UIType.DISPATCH ? (
                      <div className='w-full p-2 m-1 text-sm bg-white border-2 rounded-lg'>
                        {infos[d]}
                      </div>
                    ) : (
                      <input
                        id={d}
                        defaultValue={infos[d]}
                        className='w-full p-2 m-1 text-sm bg-white border-2 rounded-lg'
                        onChange={(e) => {
                          const div = document.getElementById(d);
                          div!.innerHTML = e.target.value;
                          infos[d] = e.target.value;
                          setInfoData(JSON.stringify(infos));
                        }}
                      />
                    )}
                  </div>
                );
              })}
              <TextField id='infomation' value={infoData} hidden />
            </>
          ) : uiType === UIType.DISPATCH ? (
            <>
              <div className='w-full h-full text-sm'>{infos}</div>
            </>
          ) : (
            <TextField
              id='infomation'
              defaultValue={
                uiType === UIType.MODIFY || uiType === UIType.DISPATCH
                  ? infos
                  : ""
              }
              className='w-full text-sm'
              multiline
              rows={5}
            />
          )}
        </div>
      </div>
    </>
  );
}

// https://reactdatepicker.com/#example-custom-time-input
export function BoardingDateComponent({ startDate, setStartDate }: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='w-28'>탑승일시</div>
        <div className='w-full m-1'>
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
    </>
  );
}

export function DispatchProcessInfo({
  title,
  value,
  id,
  isNumber = false,
}: any) {
  const [val, setVal] = useState("");

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <div className='flex flex-row items-center w-72'>
      <div className='w-28'>{title}</div>
      <div className='w-full m-3'>
        <input
          id={id}
          defaultValue={val}
          className='w-full p-3 border-dashed rounded-lg '
          type={isNumber ? "number" : "text"}
        />
      </div>
    </div>
  );
}
