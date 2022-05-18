import useUserSWR from '@hooks/swr/useUserSWR';
import useSocket from '@hooks/useSocket';
import MyStreamContainer from '@react-components/MyStreamContainer';
import PeerStreamContainer from '@react-components/PeerStreamContainer';
import StreamControlContainer from '@react-components/StreamControlContainer';
import useStore from '@store/useStore';
import RtcData from '@typings/RtcData';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useRef } from 'react';

const SheetContainer = dynamic(() => import('@react-components/SheetContainer'), { ssr: false });

const RealtimeLessonShowPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: userData } = useUserSWR();
  const { peers, addAfterMakePeer, linkState, setLinkState } = useStore((state) => state.webRTC);

  const [socket] = useSocket('lesson');

  const peerVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (userData && socket && typeof id === 'string') {
      console.log({ userData, socket, id });
      socket
        .on('connect', () => {
          console.log('lesson 소켓이 연결됨');
          socket.emit('setInit', { lessonId: parseInt(id) });
        })
        .on('getOffer', async (offerData: RtcData) => {
          console.log('offer 받음');

          try {
            const peer = await addAfterMakePeer(userData.id, false, socket);
            peer.signal(offerData.data);
          } catch (err) {
            console.error(err);
          }
        })
        .on('sendOffer', async () => {
          console.log('offer 보냄');

          try {
            await addAfterMakePeer(userData.id, true, socket);
          } catch (err) {
            console.error(err);
          }
        })
        .on('disconnect', () => {
          console.log('lesson 소켓 연결 끊김');
          // setLinkState('disconnected');
        });
    }

    return () => {
      socket?.off('connect').off('getOffer').off('sendOffer').off('disconnect');
    };
  }, [socket, userData, id]);

  return (
    <div className="bg-neutral-focus">
      <SheetContainer />
      <div className="flex gap-4">
        <MyStreamContainer />
        <PeerStreamContainer ref={peerVideoRef} />
      </div>
      <StreamControlContainer />
    </div>
  );
};

RealtimeLessonShowPage.getLayout = (page: ReactElement) => page;

export default RealtimeLessonShowPage;
