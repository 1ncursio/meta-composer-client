import Image from 'next/image';
import React, { FC } from 'react';

export interface AvatarDefaultImageProps {
  image: string | null;
  username: string;
}

const AvatarDefaultImage: FC<AvatarDefaultImageProps> = ({ image, username }) => {
  return (
    <>
      {image ? (
        <Image
          src={image}
          layout="fill"
          alt="user profile"
          //   placeholder="blur"
          className="rounded-full w-10 h-10 object-cover"
        />
      ) : (
        <div className="rounded-full w-10 h-10 bg-accent inline-flex justify-center items-center text-sm font-light text-white">
          {username[0]}
        </div>
      )}
    </>
  );
};

export default AvatarDefaultImage;
