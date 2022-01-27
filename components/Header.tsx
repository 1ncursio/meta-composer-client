import Link from "next/link";
import React from "react";
import Avatar from "./Avatar";

const Header = () => {
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
            href={`${process.env.NEXT_PUBLIC_OAUTH}`}
            className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700"
          >
            login
          </a>
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
