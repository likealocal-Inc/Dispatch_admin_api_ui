import { NextPage } from "next";
import { PageURLs, APIURLs } from "@libs/client/constants";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import ButtonLinkForPage from "@components/buttons/ButtonLink";
import ModalMessage from "@components/Modals/ModalMessage";

interface JoinForm {
  email: string;
  password: string;
  company: string;
  phone: string;
}

const Join: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit } = useForm<JoinForm>();
  const [join, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.JOIN,
  });
  const router = useRouter();

  const onValid = (validForm: JoinForm) => {
    if (loading) return;

    // 패스워드 일치 여부 확인
    const pass2: HTMLInputElement = document.getElementById(
      "password2"
    ) as HTMLInputElement;
    if (validForm.password !== pass2.value) {
      setErrorMessage("패스워드 불일치");
      setIsOpen(true);
    } else {
      join(validForm);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (data?.ok) {
        router.replace(PageURLs.LOGIN);
      } else if (data?.ok === false) {
        setErrorMessage(
          data?.data.code +
            " 동일한 회사명은 넣을 수 없음, 동일한 이메일은 등록할 수 없음"
        );
        setIsOpen(true);
      }
    }
  }, [loading, data, router]);

  return (
    <div className='h-screen py-40 bg-blueGray-800'>
      <div className='container h-full px-4 mx-auto'>
        <div className='flex items-center content-center justify-center h-full'>
          <div className='w-full px-4 lg:w-4/12'>
            <div className='relative flex flex-col w-full min-w-0 py-5 break-words border-0 rounded-lg rounded-t shadow-lg bg-blueGray-200'>
              <div className='flex-auto px-4 py-3 pt-0 lg:px-10'>
                <div className='mb-3 font-bold text-center text-blueGray-400'></div>
                <form onSubmit={handleSubmit(onValid)}>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                      htmlFor='grid-password'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                      placeholder='Email'
                      id='email'
                      required={true}
                      {...register("email")}
                    />
                  </div>

                  <div className='relative w-full mb-3'>
                    <label
                      className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                      htmlFor='grid-password'
                    >
                      Password
                    </label>
                    <input
                      type='password'
                      className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                      placeholder='Password'
                      id='password'
                      {...register("password", { required: true })}
                    />
                  </div>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                      htmlFor='grid-password'
                    >
                      Password 확인
                    </label>
                    <input
                      type='password'
                      className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                      placeholder='Password 확인'
                      id='password2'
                    />
                  </div>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                      htmlFor='grid-password'
                    >
                      Company
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                      placeholder='회사명'
                      id='company'
                      {...register("company", { required: true })}
                    />
                  </div>
                  <div className='relative w-full mb-3'>
                    <label
                      className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                      htmlFor='grid-password'
                    >
                      Phone
                    </label>
                    <input
                      type='text'
                      className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                      placeholder='연락처'
                      id='phone'
                      {...register("phone", { required: true })}
                    />
                  </div>
                  <div className='mt-6 text-center'>
                    <input
                      type='submit'
                      className='w-full px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none'
                      value={loading ? "Loading..." : "Register"}
                    />
                  </div>
                </form>
                <div className='flex justify-end'>
                  <ButtonLinkForPage label='로그인' pageUrl={PageURLs.LOGIN} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalMessage
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"회원가입 오류"}
        message={errorMessage}
      />
    </div>
  );
};

export default Join;
