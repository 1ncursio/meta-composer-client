import fetcher from '@lib/api/fetcher';
import IUser from '@typings/IUser';
import { getBackEndUrl } from '@utils/getEnv';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiBell } from 'react-icons/fi';
import useSWR from 'swr';
import Avatar from './Avatar';

const Header = () => {
  const { t } = useTranslation('common');
  const { data: userData } = useSWR<IUser>('/auth', fetcher);

  const onClickLogin = (provider: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const BACKEND_URL = getBackEndUrl();

    switch (provider) {
      case 'facebook':
        window.location.href = `${BACKEND_URL}/auth/facebook`;
        break;
      case 'google':
        window.location.href = `${BACKEND_URL}/auth/google`;
        break;
      default:
        break;
    }
  };

  return (
    <header className="container">
      <div className="navbar py-0 bg-base-100">
        <div className="navbar-start">
          <Link href="/">
            <a>
              <Image src="/logo-with-name.svg" alt="Vercel Logo" width={192} height={36} />
            </a>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li>
              <a>Item 1</a>
            </li>
            <li tabIndex={0}>
              <a>
                Parent
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/tests">
                <a>테스트</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          {userData ? (
            <>
              <Link href="/link">
                <a className="btn btn-primary btn-sm rounded-sm">{t('create-room')}</a>
              </Link>
              <input className="input bg-base-200 input-sm input-primary w-full max-w-[12rem] rounded-sm" />
              <FiBell size={24} />
              <Avatar size="small" user={userData} hasDropdown />
            </>
          ) : (
            <>
              <label htmlFor="my-modal" className="btn btn-primary btn-sm rounded-sm modal-btn">
                로그인
              </label>
              <input type="checkbox" id="my-modal" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box max-w-md">
                  <h3 className="font-bold text-lg">간편 로그인</h3>
                  <p className="py-4">로그인 모달</p>
                  <div className="flex gap-2">
                    <button
                      onClick={onClickLogin('facebook')}
                      className="btn btn-circle bg-[#2374e1] border-none hover:bg-[#2374e1]"
                    >
                      <FaFacebookF size={24} />
                    </button>
                    <button
                      onClick={onClickLogin('google')}
                      className="btn btn-circle bg-[#F8F8F8] border-none hover:bg-[#F8F8F8]"
                    >
                      <FcGoogle size={24} />
                    </button>
                  </div>
                  <div className="modal-action">
                    <label htmlFor="my-modal" className="btn">
                      닫기
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
