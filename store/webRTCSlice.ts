import Peers from '@typings/Peers';
import Peer from 'simple-peer';
import IUser from '@typings/IUser';
import { AppSlice, AppState } from './useStore';
import produce from 'immer';
import { Socket } from 'socket.io-client';
import getEnv from '@utils/getEnv';

export interface WebRTCSlice {
  webRTC: {
    peers: Peers;
    resetPeers: () => void;
    removePeer: (userId: IUser['id']) => void;
    addAfterMakePeer: (userId: IUser['id'], initiator: boolean, socket: Socket, isOculus: boolean) => Peer.Instance;
  };
}

const createWebRTCSlice: AppSlice<WebRTCSlice> = (set, get) => ({
  webRTC: {
    peers: {},
    resetPeers: () => {
      set(
        produce((state: AppState) => {
          state.webRTC.peers = {};
        }),
      );
    },
    removePeer: (userId) => {
      set(
        produce((state: AppState) => {
          delete state.webRTC.peers[userId];
        }),
      );
    },
    // TODO: media 스트림이 필요하면(Oculus 2 Oculus 연결) 미디어 스트림용 makePeer 만들어야 함
    addAfterMakePeer: (userId, initiator, socket, isOculus) => {
      const TURN_URL = getEnv('TURN_URL');
      const TURN_USERNAME = getEnv('TURN_USERNAME');
      const TURN_CREDENTIAL = getEnv('TURN_CREDENTIAL');

      if (!TURN_URL) {
        throw new Error('TURN_URL is not defined');
      }

      if (!TURN_USERNAME || !TURN_CREDENTIAL) {
        throw new Error('TURN_USERNAME or TURN_CREDENTIAL is not defined');
      }

      console.log('피어 생성 중');

      const peer = new Peer({
        initiator: initiator,
        trickle: false,
        // stream: media,
        config: {
          iceServers: [
            {
              urls: TURN_URL,
              username: TURN_USERNAME,
              credential: TURN_CREDENTIAL,
            },
          ],
        },
      });

      peer
        .on('signal', (data: Peer.SignalData) => {
          if (socket.connected) {
            console.log('시그널 왔다');
            socket.emit('getOffer', {
              data,
            });
          }
        })
        .on('connect', () => {
          console.log('피어 연결됨');
          socket.emit('peerConnectComplete', (roomId: string) => {
            console.log({ roomId });
            // if (isOculus) {
            // history.push(`/oculus/${roomId}`);
            // }
          });
        })
        .on('data', () => {
          console.log('ddd');
        })
        // .on('stream', (stream) => {
        //   if (audioTag.current) {
        //     audioTag.current.srcObject = stream;
        //   }
        // })
        .on('end', () => {
          console.log('피어 연결 끊김');
          // setMyPeer(undefined);
          // setAudio(undefined);
        })
        .on('error', (err: Error) => {
          console.error(err);
        });

      set(
        produce((state: AppState) => {
          if (!state.webRTC.peers[userId]) {
            state.webRTC.peers[userId] = peer;
          } else {
            console.log('이미 존재하는 피어');
          }
        }),
      );

      return peer;
    },
  },
});

export default createWebRTCSlice;
