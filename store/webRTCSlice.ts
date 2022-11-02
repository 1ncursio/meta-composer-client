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
    addPeer: (userId: number, peer: Peer.Instance) => void;
    resetPeers: () => void;
    removePeer: (userId: IUser['id']) => void;
    addAfterMakePeer: (
      userId: IUser['id'],
      initiator: boolean,
      socket: Socket,
      peerVideoElement?: HTMLVideoElement,
    ) => Promise<Peer.Instance>;
    linkState: 'idle' | 'connecting' | 'connected' | 'disconnected';
    setLinkState: (state: WebRTCSlice['webRTC']['linkState']) => void;
    myStream: MediaStream | null;
    getMedia: (videoElement: HTMLVideoElement, deviceId?: string) => Promise<void>;

    // 마이크 상태
    isMicMuted: boolean;
    // 카메라 상태
    isCameraOff: boolean;
    // 마이크 상태 변경
    toggleMicState: () => Promise<void>;
    // 카메라 상태 변경
    toggleCameraState: () => Promise<void>;
    getCameras: () => Promise<[MediaStreamTrack, MediaDeviceInfo[]] | undefined>;
  };
}

const createWebRTCSlice: AppSlice<WebRTCSlice> = (set, get) => ({
  webRTC: {
    peers: {},
    addPeer: (userId, peer) => {
      set(
        produce((state: AppState) => {
          state.webRTC.peers[userId] = peer;
        }),
      );
    },
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
    addAfterMakePeer: async (userId, initiator, socket, peerVideoElement) => {
      const isAlreadyPeer = get().webRTC.peers[userId];

      console.log({ peerVideoElement });
      if (isAlreadyPeer) {
        console.log('이미 존재하는 피어입니다. 기존 피어를 반환합니다.');
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

      // TODO: video true 해야됨
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      const peer = new Peer({
        initiator,
        trickle: false,
        stream,
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
        })
        .on('data', (chuck: string) => {
          const data: INoteEvent = JSON.parse(chuck);

          // console.log(data);
          switch (data.type) {
            case 'noteOn':
              console.log({ message: 'WebRTC noteOn 신호 왔음', data });
              get().piano.addPeerPressedKey(data.note);
              break;
            case 'noteOff':
              console.log({ message: 'WebRTC noteOff 신호 왔음', data });
              get().piano.removePeerPressedKey(data.note);
              break;
            default:
              break;
          }
        })
        .on('stream', (stream) => {
          console.log('스트림 오고 있는거야?');
          console.log({ stream, peerVideoElement });
          if (peerVideoElement) {
            peerVideoElement.srcObject = stream;
          } else {
            console.log('srcObject가 없어요');
          }

          peerVideoElement?.play();
        })
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
    myStream: null,
    getMedia: async (videoElement, deviceId) => {
      const initialConstrains: MediaStreamConstraints = {
        audio: true,
        video: { facingMode: 'environment' },
      };
      const cameraConstraints: MediaStreamConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstrains);

        videoElement.srcObject = stream;
        set(
          produce((state: AppState) => {
            state.webRTC.myStream = stream;
          }),
        );

        if (!deviceId) {
          await get().webRTC.getCameras();
        }
      } catch (err) {
        console.error(err);
      }
    },
    isMicMuted: false,
    isCameraOff: false,
    toggleMicState: async () => {
      const { myStream } = get().webRTC;
      if (!myStream) {
        throw new Error('myStream is not defined');
      }

      myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

      set(
        produce((state: AppState) => {
          state.webRTC.isMicMuted = !state.webRTC.isMicMuted;
        }),
      );
    },
    toggleCameraState: async () => {
      const { myStream } = get().webRTC;
      if (!myStream) {
        throw new Error('myStream is not defined');
      }

      myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));

      set(
        produce((state: AppState) => {
          state.webRTC.isCameraOff = !state.webRTC.isCameraOff;
        }),
      );
    },
    getCameras: async () => {
      try {
        const { myStream } = get().webRTC;
        if (!myStream) {
          throw new Error('myStream is not defined');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === 'videoinput');
        const currentCamera = myStream.getVideoTracks()[0];

        return [currentCamera, cameras];
      } catch (err) {
        console.error(err);
      }
    },
  },
});

export default createWebRTCSlice;
