import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import IUser from '../typings/IUser';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';

export interface AvatarProps {
  size: 'small' | 'medium' | 'big';
  user?: IUser;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  hasDropdown?: boolean;
}

const Avatar: FC<AvatarProps> = ({ size = 'small', user, onClick, hasDropdown }) => {
  if (!user) {
    return <div>loading</div>;
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <Link href="/dashboard">
        <a>
          <div tabIndex={0} className="avatar">
            <div className="w-10 rounded-full">
              <Image
                // src={optimizeImage(userData?.image ?? userThumbnail)}
                src={user.image ?? '/asd.png'}
                layout="fill"
                alt="user profile"
                // placeholder="blur"
                className="rounded-full w-10 h-10 object-cover"
              />
            </div>
          </div>
        </a>
      </Link>
      {hasDropdown && <AvatarDropdown />}
    </div>
  );
};

export default Avatar;
