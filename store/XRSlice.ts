import produce from 'immer';
import { AppSlice, AppState } from './useStore';

export const ONCLICK_HANDLER = 'onClickHandler';

export interface XRSlice {
  xr: {
    [ONCLICK_HANDLER]: (e: any, a: any) => void;
    isMicMuted: boolean;
    toggleMuteMic: () => Promise<void>;
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
  },
});

export default createXRSlice;
