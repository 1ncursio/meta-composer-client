import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import useSWR from "swr";
import client from "../lib/api/client";
import fetcher from "../lib/api/fetcher";
import IUser from "../typings/IUser";
import Avatar from "./Avatar";
const Header = () => {
  // const { data: userData } = useSWR<IUser>("/auth", fetcher);
  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);

  function test() {
    axios.get("http://localhost:4000/auth/login", {
      withCredentials: true,
    });
  }
  return (
    <header className="h-12">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-gray-900">
              <img src="/logo.png" alt="logo" className="h-8" />
            </a>
          </Link>
        </div>
        <div className="flex items-center">
          <a
            href="/vr"
            className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700"
          >
            VR
          </a>
          <a
            href="/chat"
            className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700"
          >
            Chat
          </a>
          <a
            href={`${process.env.NEXT_PUBLIC_HOST}/auth/login`}
            className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700"
          >
            {/* {userData ? userData.username : "login"} */}
          </a>
          <button onClick={test}>가자</button>
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
