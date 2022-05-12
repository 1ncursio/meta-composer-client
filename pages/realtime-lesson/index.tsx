import MyStreamContainer from '@react-components/MyStreamContainer';
import PeerStreamContainer from '@react-components/PeerStreamContainer';
// import SheetContainer from '@react-components/SheetContainer';
import StreamControlContainer from '@react-components/StreamControlContainer';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const SheetContainer = dynamic(() => import('@react-components/SheetContainer'), { ssr: false });

const RealtimeLessonPage = () => {
  return (
    <div>
      <SheetContainer />
      <div className="flex">
        <MyStreamContainer />
        <PeerStreamContainer />
      </div>
      <StreamControlContainer />
    </div>
  );
};

RealtimeLessonPage.getLayout = (page: ReactElement) => page;

export default RealtimeLessonPage;
