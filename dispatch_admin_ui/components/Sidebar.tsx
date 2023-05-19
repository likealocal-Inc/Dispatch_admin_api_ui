import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ButtonNoBorder from "./buttons/ButtonNoBorder";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLs, PageURLs } from "@libs/client/constants";

interface MenuLiProps {
  label: string;
  url: string;
}

export default function Sidebar() {
  const router = useRouter();

  // 로그아웃 처리
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

  const menuLi = ({ label, url }: MenuLiProps) => {
    return (
      <li className='items-center'>
        <Link href={url}>
          <div
            className={
              "text-sm uppercase py-3 block" +
              (router.pathname.indexOf(url) !== -1
                ? "text-yellow-400 hover:text-red-600 font-bold"
                : "text-blue-700 hover:text-blue-500")
            }
          >
            {label}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <>
      <nav className='fixed top-0 bottom-0 left-0 z-10 flex-row items-center justify-between block px-6 py-4 overflow-hidden overflow-y-auto bg-white shadow-xl w-44 flex-nowrap'>
        <div className='flex flex-col justify-between w-full min-h-full px-0 mx-auto flex-nowrap'>
          <div className='p-4 px-0 pb-2 mr-0 text-2xl font-bold text-center uppercase text-blueGray-600 whitespace-nowrap'>
            메뉴
          </div>

          <div className='relative top-0 left-0 right-0 z-40 flex flex-col flex-1 h-auto mt-4 overflow-x-hidden overflow-y-auto rounded shadow shadow-none opacity-100 '>
            <hr className='min-w-full my-4' />
            <ul className='flex flex-col min-w-full list-none'>
              {menuLi({ label: "주문리스트", url: "/admin/orders" })}
              {menuLi({ label: "사용자리스트", url: "/admin/users" })}
              {menuLi({ label: "프로필수정", url: "/admin/profile" })}
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
