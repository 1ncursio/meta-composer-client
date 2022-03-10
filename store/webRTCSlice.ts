import { INoteEvent } from '@lib/midi/NoteEvent';
import IUser from '@typings/IUser';
import Peers from '@typings/Peers';
import { getTurnCredential, getTurnUrl, getTurnUsername } from '@utils/getEnv';
import produce from 'immer';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';
import { AppSlice, AppState } from './useStore';

export interface WebRTCSlice {
  webRTC: {
    peers: Peers;
    resetPeers: () => void;
    removePeer: (userId: IUser['id']) => void;
    addAfterMakePeer: (userId: IUser['id'], initiator: boolean, socket: Socket, isOculus: boolean) => Peer.Instance;
    linkState: 'idle' | 'connecting' | 'connected' | 'disconnected';
    setLinkState: (state: WebRTCSlice['webRTC']['linkState']) => void;
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
      const isAlreadyPeer = get().webRTC.peers[userId];

      if (isAlreadyPeer) {
        console.log('이미 존재하는 피어');
        return isAlreadyPeer;
      }

      const TURN_URL = getTurnUrl();
      const TURN_USERNAME = getTurnUsername();
      const TURN_CREDENTIAL = getTurnCredential();

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
          set(
            produce((state: AppState) => {
              state.webRTC.linkState = 'connected';
            }),
          );

          socket.emit('peerConnectComplete', (roomId: string) => {
            console.log({ roomId });
            // if (isOculus) {
            // history.push(`/oculus/${roomId}`);
            // }
          });
        })
        .on('data', (chuck: string) => {
          const data: INoteEvent = JSON.parse(chuck);
          // console.log(data);
          switch (data.type) {
            case 'noteOn':
              get().piano.addPressedKey(data.note);
              break;
            case 'noteOff':
              get().piano.removePressedKey(data.note);
              break;
            default:
              break;
          }
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
          set(
            produce((state: AppState) => {
              state.webRTC.linkState = 'disconnected';
            }),
          );
        })
        .on('error', (err: Error) => {
          console.error(err);
        });

      set(
        produce((state: AppState) => {
          state.webRTC.peers[userId] = peer;
        }),
      );

      return peer;
    },
    linkState: 'idle',
    setLinkState: (linkState) => {
      set(
        produce((state: AppState) => {
          state.webRTC.linkState = linkState;
        }),
      );
    },
  },
});

export default createWebRTCSlice;
