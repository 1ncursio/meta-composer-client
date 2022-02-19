import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import useTabs from '../../hooks/useTabs';
import * as styles from './styles';
import { AiOutlinePieChart } from 'react-icons/ai';
import { RiBookLine } from 'react-icons/ri';

const AvatarDropdown = () => {
  const { t } = useTranslation('common');
  const { tab, selectTab } = useTabs();

  return (
    <div tabIndex={0} className="shadow card card-compact dropdown-content bg-base-100 w-80 rounded-none">
      <div className="card-body">
        <h3 className="card-title">Card Title</h3>
      </div>
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
      </ul>
    </div>
  );
};

export default AvatarDropdown;
