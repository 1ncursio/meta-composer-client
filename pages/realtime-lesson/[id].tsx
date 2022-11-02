import useUserSWR from '@hooks/swr/useUserSWR';
import useSocket from '@hooks/useSocket';
import MyStreamContainer from '@react-components/MyStreamContainer';
import PeerStreamContainer from '@react-components/PeerStreamContainer';
import StreamControlContainer from '@react-components/StreamControlContainer';
import useStore from '@store/useStore';
import RtcData from '@typings/RtcData';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';

const SheetContainer = dynamic(() => import('@react-components/SheetContainer'), { ssr: false });

const RealtimeLessonShowPage = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const router = useRouter();
  const { id } = router.query;

  const { data: userData } = useUserSWR();
  const { peers, addPeer, addAfterMakePeer, linkState, setLinkState } = useStore((state) => state.webRTC);

  const peerVideoRef = useRef<HTMLVideoElement | null>(null);

  const lessonId = useMemo(() => {
    if (typeof id === 'string') {
      console.log({ id });
      return parseInt(id);
    }

    console.error('레슨 아이디가 string이 아니므로 0을 반환합니다.');
    return 0;
  }, [id]);

  const [socket] = useSocket(workspaceName, { lessonId });

  useEffect(() => {
    if (lessonId && userData) {
      console.log('레슨 아이디가 있고 유저 데이터가 있으므로 웹소켓 연결을 시도합니다.', { lessonId });
      setWorkspaceName('lesson');
    }
  }, [lessonId, userData]);

  useEffect(() => {
    if (userData && socket && typeof id === 'string') {
      console.log({ socket });
      socket
        .on('connect', () => {
          console.log('lesson 소켓이 연결됨');
          //   socket.emit('setInit');
        })
        .on('getOffer', async (offerData: RtcData) => {
          console.log('offer 받음');

          try {
            const peer = await addAfterMakePeer(userData.id, false, socket, peerVideoRef.current as HTMLVideoElement);
            peer.signal(offerData.data);
            socket.emit('');
          } catch (err) {
            console.error(err);
          }
        })
        .on('sendOffer', async () => {
          console.log('offer 보냄');

          try {
            await addAfterMakePeer(userData.id, true, socket, peerVideoRef.current as HTMLVideoElement);
          } catch (err) {
            console.error(err);
          }
        })
        .on('peerList', ({ userId, peer }: { userId: number; peer: SimplePeer.Instance }) => {
          addPeer(userId, peer);
        })
        .on('disconnect', () => {
          console.log('lesson 소켓 연결 끊김');
          // setLinkState('disconnected');
        });
    }

    return () => {
      socket?.off('connect').off('getOffer').off('sendOffer').off('disconnect');
    };
  }, [socket, userData, id, peerVideoRef.current]);

  return (
    <div className="bg-neutral-focus h-full flex flex-col justify-between">
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
