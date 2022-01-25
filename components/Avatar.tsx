import Image from "next/image";
import React, { useEffect } from "react";
import useSWR from "swr";
import fetcher from "../lib/api/fetcher";
import IUser from "../typings/IUser";

const Avatar = () => {
  const { data: userData } = useSWR<IUser>("/auth", fetcher);

  useEffect(() => {
    if (userData) {
      console.log(userData);
    }
  }, [userData]);

  if (!userData) {
    return <div>loading</div>;
  }

  return (
    <button className="cursor-pointer w-10 h-10 relative">
      <Image
        // src={optimizeImage(userData?.image ?? userThumbnail)}
        src={userData.image ?? "/asd.png"}
        layout="fill"
        alt="user profile"
        // placeholder="blur"
        className="rounded-full w-10 h-10 object-cover"
      />
    </button>
  );
};

export default Avatar;
