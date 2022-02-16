import Link from 'next/link';
import React from 'react';
import Avatar from './Avatar';

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
          <Link href="/vr">
            <a className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700">
              VR
            </a>
          </Link>
          <Link href="/piano">
            <a className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700">
              Piano
            </a>
          </Link>
          <Link href="/piano-webrtc">
            <a className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700">
              피아노 WebRTC 테스트
            </a>
          </Link>
          <Link href="/chat">
            <a className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700">
              Chat
            </a>
          </Link>
          <Link href="/channel">
            <a className="px-4 py-2 text-gray-900 border-b-2 border-gray-900 hover:border-gray-700 hover:text-gray-700">
              채널
            </a>
          </Link>
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Header;
