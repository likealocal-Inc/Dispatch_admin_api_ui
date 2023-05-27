import { UserModel } from "@libs/client/models/user.model";
import { TextField } from "@mui/material";
import DaumPostcode from "react-daum-postcode";

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
  dispatch,
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
