import { AppSlice } from './useStore';

export const ONCLICK_HANDLER = 'onClickHandler';

export interface XRSlice {
  xr: {
    [ONCLICK_HANDLER]: (e: any, a: any) => void;
  };
}

const createXRSlice: AppSlice<XRSlice> = (set, get) => ({
  xr: {
    [ONCLICK_HANDLER](e, a) {
      console.log({ e, a });
    },
  },
});

export default createXRSlice;
