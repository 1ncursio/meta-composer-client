import Link from 'next/link';
import React from 'react';

const TestsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/vr">
        <a className="link link-secondary link-hover">VR 페이지</a>
      </Link>
      <Link href="/piano">
        <a className="link link-secondary link-hover">피아노 미디 연결 페이지</a>
      </Link>
      <Link href="/piano-webrtc/1">
        <a className="link link-secondary link-hover">피아노 WebRTC 연결 페이지</a>
      </Link>
    </div>
  );
};

export default TestsPage;
