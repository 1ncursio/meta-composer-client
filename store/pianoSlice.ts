import { RenderInfoByTrackMap } from '@lib/midi/Render';
import produce from 'immer';
import { AppSlice, AppState } from './useStore';

export interface PianoSlice {
  piano: {
    midi: WebMidi.MIDIAccess | null;
    pressedKeys: Set<number>;
    initMidi: (midiAccess: WebMidi.MIDIAccess) => void;
    addPressedKey: (key: number) => void;
    removePressedKey: (key: number) => void;
    renderInfoByTrackMap: RenderInfoByTrackMap;
    setRenderInfoByTrackMap: (renderInfoByTrackMap: RenderInfoByTrackMap) => void;
  };
}

const createPianoSlice: AppSlice<PianoSlice> = (set, get) => ({
  piano: {
    midi: null,
    pressedKeys: new Set(),
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
    removePressedKey: (key) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.delete(key);
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
