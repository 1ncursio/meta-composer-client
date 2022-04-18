// @ts-nocheck

import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import MIDImessage from 'midimessage';
import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import React, { useCallback, useEffect, useState } from 'react';
import Peer, { SignalData } from 'simple-peer';
import client from '@lib/api/client';
import useStore from '@store/useStore';
import Rtc from '@typings/Rtc';

const PianoWebRTCPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isPeersConnected, setIsPeersConnected] = useState(false);
  // const { onClickHTMLButton, isMidiConnected } = useMIDI();
  const { inputs, outputs, hasMIDI } = useMIDI(); // Initially returns [[], []]
  const message = useMIDIMessage(inputs[0]);
  const { pressedKeys, addPressedKey, removePressedKey } = useStore((state) => state.piano);
  const { peers, removePeer, resetPeers } = useStore((state) => state.webRTC);

  // midimessage 발생했을 때 실행
  useEffect(() => {
    if (message) {
      const midiMessage = new MIDImessage(message);
      // console.log(JSON.stringify(midiMessage));
      // console.log({ midiMessage });
      if (id === '2') {
        // message to ArrayBuffer
        peers['1']?.send(JSON.stringify(midiMessage));
      }
    }
  }, [message]);

  const gett = useCallback(
    (initiator: boolean, id: number) => {
      if (peers[id]) {
        return peers[id];
      }

      console.log('Peer 생성 중...');
      const peer = new Peer({
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
        .on('signal', (data: SignalData) => {
          client.post('/pusher', {
            userId: id,
            data,
          });
        })
        .on('connect', () => {
          console.log('connect complete');
          setIsPeersConnected(true);
        })
        .on('data', (chunk: any) => {
          // Uint8Array 형식의 데이터를 받아서 JSON 형식으로 변환하여 전달한다.
          const midimessage = JSON.parse(String.fromCharCode.apply(null, chunk));

          switch (midimessage.messageType) {
            case 'noteon':
              // playerRef.current.play(midimessage.key);
              addPressedKey(midimessage.key);
              // peers['1'].send(midimessage.key);
              break;
            case 'noteoff':
              // playerRef.current.stop(midimessage.key);
              removePressedKey(midimessage.key);
              break;
            default:
              break;
          }
        })
        .on('end', () => {
          console.log('끊김');
          resetPeers();
        })
        .on('error', (err: Error) => {
          console.log(err);
        });
      return peer;
    },
    [peers, resetPeers],
  );

  const getPeer = (initiator: boolean) => (e: React.MouseEvent) => {
    const userId = id === '1' ? 2 : 1;
    return gett(true, userId);
  };

  function testSend() {
    peers['1'].send(
      JSON.stringify({
        key: 30,
      }),
    );
  }

  useEffect(() => {
    const pusher = new Pusher('eef5f3bc1c485b22d058', {
      cluster: 'ap3',
    });

    const channel = pusher.subscribe('chat');

    channel.bind('event', function (event) {
      const offerData: Rtc = event.data;
      if (offerData.userId === id) {
        const peer = gett(false, id === '1' ? 2 : 1);
        console.log('check', peer);
        peer.signal(offerData.data);
      }
    });
    channel.bind('close', function (event: any) {});

    return () => {
      pusher.unsubscribe('chat');
      for (const key in peers) {
        peers[key].destroy();
        // removePeer(parseInt(key));
      }
      setIsPeersConnected(false);
    };
  }, [id, peers, gett]);

  useEffect(() => {
    if (peers) {
      console.log({ peers });
    }
  }, [peers]);

  return (
    <div>
      <div>Chat Page</div>
      <div className="flex gap-2">
        {isPeersConnected ? (
          <button className="bg-yellow-500 text-white font-bold p-2 rounded-lg">WebRTC 연결됨</button>
        ) : (
          <button className="bg-yellow-500 text-white font-bold p-2 rounded-lg" onClick={getPeer(true)}>
            WebRTC 연결하기
          </button>
        )}

        <button className="bg-blue-500 text-white font-bold p-2 rounded-lg" onClick={testSend}>
          이벤트 보내기
        </button>
        {Array.from(pressedKeys).map((key) => (
          <div key={key}>{key}</div>
        ))}
        {/* {isMidiConnected ? (
          <button className="bg-green-500 text-white font-bold p-2 rounded-lg">미디 피아노 연결 완료</button>
        ) : (
          <button className="bg-green-500 text-white font-bold p-2 rounded-lg" onClick={onClickHTMLButton}>
            미디 피아노 연결하기
          </button>
        )} */}
      </div>
      <div>
        {Object.keys(peers).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </div>
      {/* <div>Message Data: {message.data ? message.data.join(', ') : ''}</div> */}
    </div>
  );
};

export default PianoWebRTCPage;
