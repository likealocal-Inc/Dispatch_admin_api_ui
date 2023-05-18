import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ButtonLinkForPage from "./buttons/ButtonLink";
import Button01 from "./buttons/Button01";
import ButtonNoBorder from "./buttons/ButtonNoBorder";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLs, PageURLs } from "@libs/client/constants";

export default function Sidebar() {
  const router = useRouter();

  const [logout, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.LOGOUT,
  });

  useEffect(() => {
    if (!loading) {
      if (data?.ok) {
        router.replace(PageURLs.ROOT);
      }
    }
  }, [loading, data]);
  return (
    <>
      <nav className='fixed top-0 bottom-0 left-0 z-10 flex-row items-center justify-between block w-40 px-6 py-4 overflow-hidden overflow-y-auto bg-white shadow-xl flex-nowrap'>
        <div className='flex flex-col justify-between w-full min-h-full px-0 mx-auto flex-nowrap'>
          <div className='p-4 px-0 pb-2 mr-0 text-2xl font-bold text-center uppercase text-blueGray-600 whitespace-nowrap'>
            메뉴
          </div>

          <div className='relative top-0 left-0 right-0 z-40 flex flex-col flex-1 h-auto mt-4 overflow-x-hidden overflow-y-auto rounded shadow shadow-none opacity-100 '>
            <hr className='min-w-full my-4' />
            <ul className='flex flex-col min-w-full list-none'>
              <li className='items-center'>
                <Link href='/admin/orders'>
                  <div
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/orders") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    주문리스트
                  </div>
                </Link>
              </li>
              <li className='items-center'>
                <Link href='/admin/users'>
                  <div
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/users") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    사용자리스트
                  </div>
                </Link>
              </li>
              <li className='items-center'>
                <Link href='/admin/settings'>
                  <div
                    className={
                      "text-xs uppercase py-3 font-bold block " +
                      (router.pathname.indexOf("/admin/settings") !== -1
                        ? "text-lightBlue-500 hover:text-lightBlue-600"
                        : "text-blueGray-700 hover:text-blueGray-500")
                    }
                  >
                    프로필
                  </div>
                </Link>
              </li>
              <li>
                <div className='absolute bottom-2'>
                  <ButtonNoBorder onClick={() => logout()} label={"로그아웃"} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
