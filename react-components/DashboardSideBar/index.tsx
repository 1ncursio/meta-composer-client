import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AiFillPieChart, AiOutlinePieChart } from 'react-icons/ai';
import {
  BsBell,
  BsBellFill,
  BsChatLeft,
  BsChatLeftFill,
  BsCreditCard2Back,
  BsCreditCard2BackFill,
  BsFileEarmarkMusic,
  BsFileEarmarkMusicFill,
  BsPerson,
  BsPersonFill,
} from 'react-icons/bs';
import { MdAssignment, MdOutlineAssignment } from 'react-icons/md';
import {
  RiBookFill,
  RiBookLine,
  RiSettings3Fill,
  RiSettings3Line,
  RiShoppingBag2Fill,
  RiShoppingBag2Line,
} from 'react-icons/ri';
import * as styles from './styles';

const iconSize = 20;

const DashboardSideBar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname } = router;

  const paths = [
    {
      path: '/dashboard',
      title: t('dashboard'),
      icon: {
        unselected: <AiOutlinePieChart size={iconSize} />,
        selected: <AiFillPieChart size={iconSize} />,
      },
    },
    {
      path: '/notifications',
      title: t('notifications'),
      icon: {
        unselected: <BsBell size={iconSize} />,
        selected: <BsBellFill size={iconSize} />,
      },
    },
    {
      path: '/my-courses',
      title: t('my-courses'),
      icon: {
        unselected: <RiBookLine size={iconSize} />,
        selected: <RiBookFill size={iconSize} />,
      },
    },
    {
      path: '/my-sheets',
      title: t('my-sheets'),
      icon: {
        unselected: <BsFileEarmarkMusic size={iconSize} />,
        selected: <BsFileEarmarkMusicFill size={iconSize} />,
      },
    },
    {
      path: '/my-profile',
      title: t('my-profile'),
      icon: {
        unselected: <BsPerson size={iconSize} />,
        selected: <BsPersonFill size={iconSize} />,
      },
    },
    {
      path: '/wishlist',
      title: t('wishlist'),
      icon: {
        unselected: <RiShoppingBag2Line size={iconSize} />,
        selected: <RiShoppingBag2Fill size={iconSize} />,
      },
    },
    {
      path: '/payments',
      title: t('payments'),
      icon: {
        unselected: <BsCreditCard2Back size={iconSize} />,
        selected: <BsCreditCard2BackFill size={iconSize} />,
      },
    },
    {
      path: '/assignments',
      title: t('assignments'),
      icon: {
        unselected: <MdOutlineAssignment size={iconSize} />,
        selected: <MdAssignment size={iconSize} />,
      },
    },
    {
      path: '/chats',
      title: t('chats'),
      icon: {
        unselected: <BsChatLeft size={iconSize} />,
        selected: <BsChatLeftFill size={iconSize} />,
      },
    },
    {
      path: '/settings',
      title: t('settings'),
      icon: {
        unselected: <RiSettings3Line size={iconSize} />,
        selected: <RiSettings3Fill size={iconSize} />,
      },
    },
  ];

  useEffect(() => {
    console.log(`pathname: ${pathname}`);
  }, [pathname]);

  return (
    <aside>
      <ul>
        {paths.map(({ path, title, icon: { selected, unselected } }) => (
          <li key={path}>
            <Link href={path}>
              {/* 하위 있는것도 select 되게 함 정세 */}
              <a className={styles.dashboardLink(pathname.includes(path))}>
                {pathname.includes(path) ? selected : unselected}
                {title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardSideBar;
