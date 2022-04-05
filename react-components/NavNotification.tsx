import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import IUser from '@typings/IUser';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';
import AvatarDefaultImage from './AvatarDefaultImage';
import { BsBell } from 'react-icons/bs';
import NotificationDropdown from './AvatarDropdown/NotificationDropdown';
import { INotification } from '@typings/INotification';

export interface NavNoptificationProps {
  user?: IUser;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  hasDropdown?: boolean;
}

const NavNoptification: FC<NavNoptificationProps> = ({ user, onClick, hasDropdown }) => {
  if (!user) {
    return <div>loading</div>;
  }

  if (!hasDropdown) {
    return <BsBell size={40} />;
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover ">
      <Link href="/dashboard">
        <a>
          <div tabIndex={0} className="avatar">
            {/* <div className="w-10 rounded-full"> */}
            <BsBell size={24} />
            {/* </div> */}
          </div>
        </a>
      </Link>
      {hasDropdown && <NotificationDropdown />}
    </div>
  );
};

export default NavNoptification;
