import produce from 'immer';
import create from 'zustand';

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
    pressedKeys: new Set<number>(),
    addPressedKey: (key: number) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.add(key);
        }),
      );
    },
    removePressedKey: (key: number) => {
      set(
        produce((state: AppState) => {
          state.piano.pressedKeys.delete(key);
        }),
      );
    },
  },
}));

export default useStore;
