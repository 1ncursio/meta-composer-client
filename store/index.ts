import produce, { enableMapSet } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from 'zustand';
import client from '../lib/api/client';
import { UserState } from './userState';
import { WebRTCState } from './webRTCState';

enableMapSet();

export interface AppState {
  user: UserState;
  piano: {
    midi: WebMidi.MIDIAccess | null;
    initMidi: (midiAccess: WebMidi.MIDIAccess) => void;
    // midiInput: Map<string, WebMidi.MIDIInput>;
    // midiOutput: Map<string, WebMidi.MIDIOutput>;
    // loading: boolean;
    // error: Error | null;
    pressedKeys: Set<number>;
    addPressedKey: (key: number) => void;
    removePressedKey: (key: number) => void;
  };
  webRTC: WebRTCState;
}

const useStore = create<AppState>((set, get) => ({
  user: {
    accessToken: '',
    setAccessToken: (accessToken) => {
      set((state) =>
        produce(state, (draft) => {
          draft.user.accessToken = accessToken ?? '';
          client.defaults.headers.common.authorization = accessToken ?? '';
        }),
      );
    },
  },
  piano: {
    midi: null,
    initMidi: (midiAccess: WebMidi.MIDIAccess) => {
      set(
        produce((state: AppState) => {
          state.piano.midi = midiAccess;
        }),
      );
    },
    pressedKeys: new Set(),
    addPressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.add(key);
        }),
      );
    },
    removePressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.delete(key);
        }),
      );
    },
  },
  webRTC: {
    peers: {},
    resetPeers: () => {
      set(
        produce((state: AppState) => {
          state.webRTC.peers = {};
        }),
      );
    },
    addPeer: (userId, peer) => {
      set(
        produce((state: AppState) => {
          state.webRTC.peers[userId] = peer;
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
  },
}));

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  /**
   * simple-zustand-devtool 의 타입과 store의 타입이 다르지만, 동작에는 문제가 없으므로 이렇게 해둠.
   * 그리고 Next.js 서버에서 먼저 한 번 실행되는데, 서버에는 window가 없으므로 이렇게 해둠.
   */
  // @ts-ignore
  mountStoreDevtool('Store', useStore);
}

export default useStore;
