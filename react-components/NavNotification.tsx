import Image from 'next/image';
import Link from 'next/link';
import React, { FC, useEffect, useRef, useState } from 'react';
import IUser from '@typings/IUser';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';
import AvatarDefaultImage from './AvatarDefaultImage';
import { BsBell } from 'react-icons/bs';
import NotificationDropdown from './AvatarDropdown/NotificationDropdown';
import { INotification } from '@typings/INotification';
import useSocket from '@hooks/useSocket';

export interface NavNoptificationProps {
  user?: IUser;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  hasDropdown?: boolean;
}

const NavNoptification: FC<NavNoptificationProps> = ({ user, onClick, hasDropdown }) => {
  const [socket] = useSocket('notification');
  const [color, setColor] = useState<string>();

  useEffect(() => {
    socket?.on('notification', (msg: INotification) => {
      console.log(msg);
      setColor('red');
      // for (let i = 0; i < 10; i++) {
      //   if (i % 2 == 0) {
      //     setTimeout(() => {
      //       setColor('red');
      //     }, 1000);
      //   } else {
      //     setTimeout(() => {
      //       setColor('');
      //     }, 1000);

      //   }
      // }
    });
  }, [socket]);
  if (!user) {
    return <div>loading</div>;
  }

  if (!hasDropdown) {
    return <BsBell size={40} />;
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover ">
      <Link href="/notifications">
        <a>
          <div tabIndex={0} className="avatar">
            {/* <div className="w-10 rounded-full"> */}
            <BsBell size={24} color={color} />
            {/* </div> */}
          </div>
        </a>
      </Link>
      {hasDropdown && <NotificationDropdown />}
    </div>
  );
};

export default NavNoptification;
