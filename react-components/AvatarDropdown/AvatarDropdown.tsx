import useUserSWR from '@hooks/swr/useUserSWR';
import useTabs from '@hooks/useTabs';
import client from '@lib/api/client';
import useStore from '@store/useStore';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { AiOutlinePieChart } from 'react-icons/ai';
import { RiBookLine, RiSettings3Line } from 'react-icons/ri';
import * as styles from './styles';

const AvatarDropdown = () => {
  const { t } = useTranslation('common');
  const { tab, selectTab } = useTabs();
  const { data: userData, mutate } = useUserSWR();
  const { resetUserData } = useStore((state) => state.user);
  const router = useRouter();

  const onClickLogOut = useCallback(async () => {
    if (!userData) return;

    try {
      await client.get('/auth/logout');
      resetUserData();
      mutate();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  }, [userData, router, mutate, resetUserData]);

  return (
    <div tabIndex={0} className="shadow card card-compact dropdown-content bg-base-100 w-80 rounded-none">
      <div className="card-body">{/* <h3 className="card-title">Card Title</h3> */}</div>
      <div className="tabs">
        <button onClick={selectTab(0)} className={styles.tab(tab === 0)}>
          {t('student')}
        </button>
        <button onClick={selectTab(1)} className={styles.tab(tab === 1)}>
          {t('teacher')}
        </button>
      </div>
      <ul className="menu">
        <li className="flex flex-row items-center">
          <Link href="/dashboard">
            <a className="flex-1">
              <AiOutlinePieChart size={24} />
              {t('dashboard')}
            </a>
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <Link href="/my-courses">
            <a className="flex-1">
              <RiBookLine size={24} />
              {t('my-courses')}
            </a>
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <Link href="/settings">
            <a className="flex-1">
              <RiSettings3Line size={24} />
              {t('settings')}
            </a>
          </Link>
        </li>
        <li className="flex flex-row items-center">
          <button onClick={onClickLogOut} className="flex-1">
            로그아웃
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AvatarDropdown;
