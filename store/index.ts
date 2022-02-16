import produce, { enableMapSet } from 'immer';
import create from 'zustand';
import { WebRTCState } from './webRTCState';

enableMapSet();

export interface AppState {
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

const useStore = create<AppState>((set) => ({
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

export default useStore;
