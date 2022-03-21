import produce from 'immer';
import { AppSlice, AppState } from './useStore';

export const ONCLICK_HANDLER = 'onClickHandler';

export interface XRSlice {
  xr: {
    [ONCLICK_HANDLER]: (e: any, a: any) => void;
    isMicMuted: boolean;
    muteMic: () => void;
    unmuteMic: () => void;
    toggleMic: () => void;
  };
}

const createXRSlice: AppSlice<XRSlice> = (set, get) => ({
  xr: {
    [ONCLICK_HANDLER](e, a) {
      console.log({ e, a });
    },
    isMicMuted: true,
    muteMic: () => {
      set(
        produce((state: AppState) => {
          state.xr.isMicMuted = true;
        }),
      );
    },
    unmuteMic: () => {
      set(
        produce((state: AppState) => {
          state.xr.isMicMuted = false;
        }),
      );
    },
    toggleMic: () => {
      set(
        produce((state: AppState) => {
          state.xr.isMicMuted = !state.xr.isMicMuted;
        }),
      );
    },
  },
});

export default createXRSlice;
