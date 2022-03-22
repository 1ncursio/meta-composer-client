import produce from 'immer';
import { AppSlice, AppState } from './useStore';

export const ONCLICK_HANDLER = 'onClickHandler';

export interface XRSlice {
  xr: {
    [ONCLICK_HANDLER]: (e: any, a: any) => void;
    isMicMuted: boolean;
    toggleMuteMic: () => Promise<void>;
    isOpenSettings: boolean;
    openSettings: () => void;
    closeSettings: () => void;
    originX: number;
    originY: number;
    originZ: number;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    setOffsetX: (offsetX: number) => void;
    setOffsetY: (offsetY: number) => void;
    setOffsetZ: (offsetZ: number) => void;
  };
}

const createXRSlice: AppSlice<XRSlice> = (set, get) => ({
  xr: {
    [ONCLICK_HANDLER](e, a) {
      console.log({ e, a });
    },
    isMicMuted: false,
    toggleMuteMic: async () => {
      const { myStream } = get().webRTC;
      if (!myStream) {
        throw new Error('myStream is not defined');
      }

      myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

      set(
        produce((state: AppState) => {
          state.xr.isMicMuted = !state.xr.isMicMuted;
        }),
      );
    },
    isOpenSettings: false,
    openSettings: () => {
      set(
        produce((state: AppState) => {
          state.xr.isOpenSettings = true;
        }),
      );
    },
    closeSettings: () => {
      set(
        produce((state: AppState) => {
          state.xr.isOpenSettings = false;
        }),
      );
      //   document.removeChild(document.getElementById('settings-layout'));
    },
    originX: 0,
    originY: 0,
    originZ: 0,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    setOffsetX: (offsetX) => {
      set(
        produce((state: AppState) => {
          state.xr.offsetX = offsetX;
        }),
      );
    },
    setOffsetY: (offsetY) => {
      set(
        produce((state: AppState) => {
          state.xr.offsetY = offsetY;
        }),
      );
    },
    setOffsetZ: (offsetZ) => {
      set(
        produce((state: AppState) => {
          state.xr.offsetZ = offsetZ;
        }),
      );
    },
  },
});

export default createXRSlice;
