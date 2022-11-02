import { RenderInfoByTrackMap } from '@lib/midi/Render';
import produce from 'immer';
import { AppSlice, AppState } from './useStore';

export interface PianoSlice {
  piano: {
    midi: WebMidi.MIDIAccess | null;
    pressedKeys: Set<number>;
    peerPressedKeys: Set<number>;
    initMidi: (midiAccess: WebMidi.MIDIAccess) => void;
    addPressedKey: (key: number) => void;
    addPeerPressedKey: (key: number) => void;
    removePressedKey: (key: number) => void;
    removePeerPressedKey: (key: number) => void;
    renderInfoByTrackMap: RenderInfoByTrackMap;
    setRenderInfoByTrackMap: (renderInfoByTrackMap: RenderInfoByTrackMap) => void;
  };
}

const createPianoSlice: AppSlice<PianoSlice> = (set, get) => ({
  piano: {
    midi: null,
    pressedKeys: new Set(),
    peerPressedKeys: new Set(),
    initMidi: (midiAccess: WebMidi.MIDIAccess) => {
      set(
        produce((state) => {
          state.piano.midi = midiAccess;
        }),
      );
    },
    addPressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.add(key);
        }),
      );
    },
    addPeerPressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.peerPressedKeys.add(key);
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
    removePeerPressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.peerPressedKeys.delete(key);
        }),
      );
    },
    renderInfoByTrackMap: {},
    setRenderInfoByTrackMap: (renderInfoByTrackMap: RenderInfoByTrackMap) => {
      set(
        produce((state: AppState) => {
          state.piano.renderInfoByTrackMap = renderInfoByTrackMap;
        }),
      );
    },
  },
});

export default createPianoSlice;
