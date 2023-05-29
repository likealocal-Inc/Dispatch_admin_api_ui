import { TextField } from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";

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

export const orderTypeList = ["공항픽업", "공항샌딩", "시간대절"];

// 사용자 정보 출력 컴포넌트
export function UserInfomation({ me }: any) {
  return (
    <>
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
  isModify,
  address,
  setIsAddressSearchShow,
  locationStr,
  locationObj,
}: any) {
  return (
    <>
      <div className='flex flex-row items-center w-72'>
        <div className='w-28'>{title}명</div>
        {selectType === orderType ? (
          <>
            {isModify
              ? airportSelectTag(locationStr, locationObj)
              : airportSelectTag(locationStr)}
          </>
        ) : (
          <div className='w-full m-3'>
            <TextField
              id={locationStr}
              defaultValue={isModify ? locationObj : ""}
              className='w-full'
            />
          </div>
        )}
      </div>
      <div className='flex flex-row items-center w-72'>
        <div className='w-28'>{title}주소</div>
        <div className='w-full m-3'>
          {selectType === orderType ? (
            <>
              <TextField
                value={selectType}
                className='w-full bg-slate-300'
                disabled
              />
            </>
          ) : (
            <TextField
              value={address}
              className='w-full'
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

export function InfomationComponent({ isModify, information, isIamweb }: any) {
  const [infoData, setInfoData] = useState<any>();

  let infos: any;

  if (isModify) {
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
        <div className='w-28'>전달사항</div>
        <div className='w-full p-2 border-2'>
          {isIamweb === true && infos !== undefined ? (
            <>
              {Object.keys(infos).map((d) => {
                return (
                  <div key={d} className='flex flex-row justify-between'>
                    <div className='w-full p-2 m-1 rounded-lg bg-slate-200'>
                      {d}
                    </div>
                    <input
                      id={d}
                      defaultValue={infos[d]}
                      className='p-2 m-1 bg-white border-2 rounded-lg'
                      onChange={(e) => {
                        const div = document.getElementById(d);
                        div!.innerHTML = e.target.value;
                        infos[d] = e.target.value;
                        setInfoData(JSON.stringify(infos));
                      }}
                    />
                  </div>
                );
              })}
              <TextField id='infomation' value={infoData} hidden />
            </>
          ) : (
            <TextField
              id='infomation'
              defaultValue={isModify ? infos : ""}
              className='w-full'
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
    </>
  );
}
