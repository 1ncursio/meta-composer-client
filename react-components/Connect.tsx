import Link from 'next/link';
import { useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import useSWR from 'swr';
import fetcher from '../lib/api/fetcher';
import IUser from '../typings/IUser';
import RtcData from '../typings/RtcData';

const Connect = () => {
  const { data: userData } = useSWR<IUser>('/auth', fetcher);
  const [connected, setConnected] = useState<boolean>(false);
  const [myPeer, setMyPeer] = useState<Peer.Instance>();
  const [soket, setSoket] = useState<Socket>();

  useEffect(() => {
    //useSocket 찾아 보기
    if (userData && !connected) {
      const socket = io('https://jungse.shop/webRtc');
      setSoket(socket);
      setConnected(true);
    }
  }, [userData, connected]);

  useEffect(() => {
    if (soket) {
      soket.removeListener();
      soket
        .on('connect', () => {
          console.log('soket on');
          soket.emit('setInit', {
            userId: userData?.id,
          });
        })
        .on('getOffer', (offerData: RtcData) => {
          console.log('offer 받음');
          const peer = makePeer(false, soket, myPeer);
          peer?.signal(offerData);
          setMyPeer(peer);
        })
        .on('sendOffer', () => {
          setMyPeer(makePeer(true, soket, myPeer));
        });
    }

    //     1.dependancy(두번째 인자로 넘기는 배열)가 바뀌어서 effect가 달라져야할 때 (이전 effect 청소)
    //   2. 해당 component가 unmount 될 때

    return () => {
      if (soket && myPeer) {
        console.log('실행');
        setTimeout(() => {
          soket.emit('selfDisconnect', {
            userId: userData?.id,
          });
        });
      }
    };
  }, [soket, myPeer]);

  // const auth = useCallback(
  //   (initiator: boolean, soket: Socket) => () => {\
  //   },
  //   []
  // );

  const makePeer = (initiator: boolean, soket: Socket, myPeer: Peer.Instance | undefined) => {
    console.log({ myPeer }, 'makepeer');
    if (myPeer === undefined) {
      console.log('만드는중');
      let peer = new Peer({
        initiator: initiator,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com',
            },
            {
              urls: 'turn:numb.viagenie.ca:3478?transport=udp',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              username: '28224511:1379330808',
            },
            {
              urls: 'turn:numb.viagenie.ca?transport=tcp',
              credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
              username: '28224511:1379330808',
            },
          ],
        },
      });
      peer
        .on('signal', (data: Peer.SignalData) => {
          if (soket && userData) {
            console.log('heepw');
            soket.emit('getOffer', {
              userId: userData.id,
              data,
            });
          }
        })
        .on('connect', (stream: any) => {
          console.log('Peer connet complate!!!');
        })
        .on('data', () => {
          console.log('ddd');
        })
        .on('end', () => {
          console.log('끊김');
          setMyPeer(undefined);
        })
        .on('error', (err: Error) => {
          console.log(err);
        });
      return peer;
    } else {
      return myPeer;
    }
  };
  return (
    <div>
      <div> childeren</div>
      <Link href="/">
        <a className="text-2xl font-bold text-gray-900">
          <img src="/logo.png" alt="logo" className="h-8" />
        </a>
      </Link>
    </div>
  );
};

export default Connect;
