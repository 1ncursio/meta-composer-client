import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import IUser from '@typings/IUser';
import AvatarDropdown from './AvatarDropdown/AvatarDropdown';
import AvatarDefaultImage from './AvatarDefaultImage';

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

  if (!hasDropdown) {
    return (
      <div className="avatar">
        <div className="w-10 rounded-full">
          <AvatarDefaultImage image={user.profile_image} username={user.username} />
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <Link href="/dashboard">
        <a>
          <div tabIndex={0} className="avatar">
            <div className="w-10 rounded-full">
              <AvatarDefaultImage image={user.profile_image} username={user.username} />
            </div>
          </div>
        </a>
      </Link>
      {hasDropdown && <AvatarDropdown />}
    </div>
  );
};

export default Avatar;
