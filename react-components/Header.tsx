import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/api/fetcher';
import IUser from '../typings/IUser';
import Avatar from './Avatar';
import { FiBell } from 'react-icons/fi';
import { AiOutlinePieChart } from 'react-icons/ai';
import { useTranslation } from 'next-i18next';

const Header = () => {
  const { t } = useTranslation('common');
  const { data: userData } = useSWR<IUser>('/auth', fetcher);

  const onCreateRoom = useCallback((e) => {
    e.preventDefault();
    console.log('onCreateRoom');
  }, []);

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
          <button type="button" onClick={onCreateRoom} className="btn btn-primary btn-sm rounded-sm">
            {t('create-room')}
          </button>
          <input className="input bg-base-200 input-sm input-primary w-full max-w-[12rem] rounded-sm" />
          <FiBell size={24} />
          <Avatar size="small" user={userData} hasDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
