import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import useSWR from 'swr';
import fetcher from '../lib/api/fetcher';
import useStore from '../store';
import IUser from '../typings/IUser';
import RtcData from '../typings/RtcData';

const Connect = () => {
  const { data: userData } = useSWR<IUser>('/auth', fetcher);
  const [connected, setConnected] = useState<boolean>(false);
  const [myPeer, setMyPeer] = useState<Peer.Instance>();
  const [soket, setSoket] = useState<Socket>();
  const [audio, setAudio] = useState<MediaStream>();
  const { accessToken } = useStore((state) => state.user);

  const audioTag = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    //useSocket 찾아 보기
    if (userData && !connected && accessToken) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
        const socket = io('https://jungse.shop/webRtc', {
          transports: ['websocket'],
          withCredentials: true,
          extraHeaders: {
            authorization: accessToken ?? '',
          },
        });
        setAudio(res);
        setSoket(socket);
        setConnected(true);
        console.log(userData.id);
      });
    }
  }, [userData, connected, accessToken]);

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
          if (audio) {
            const peer = makePeer(false, soket, myPeer, audio);
            peer?.signal(offerData);
            setMyPeer(peer);
          }
        })
        .on('sendOffer', () => {
          console.log({ audio });
          if (audio) {
            setMyPeer(makePeer(true, soket, myPeer, audio));
          }
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

  const makePeer = (initiator: boolean, soket: Socket, myPeer: Peer.Instance | undefined, media: MediaStream) => {
    console.log({ myPeer }, 'makepeer');
    if (myPeer === undefined) {
      console.log('만드는중');

      if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
        throw new Error('process.env.NEXT_PUBLIC_SOCKET_URL is not defined');
      }

      const peer = new Peer({
        initiator: initiator,
        trickle: false,
        stream: media,
        config: {
          iceServers: [
            {
              urls: process.env.NEXT_PUBLIC_SOCKET_URL,
              username: process.env.NEXT_PUBLIC_TURN_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
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
        .on('stream', (stream) => {
          if (audioTag.current) {
            audioTag.current.srcObject = stream;
          }
        })
        .on('end', () => {
          console.log('끊김');
          setMyPeer(undefined);
          setAudio(undefined);
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
      <audio ref={audioTag} controls autoPlay />
    </div>
  );
};

export default Connect;
