import { isDev } from '@utils/getEnv';
import { enableMapSet } from 'immer';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create, { GetState, SetState } from 'zustand';
import createPianoSlice, { PianoSlice } from './pianoSlice';
import createUserSlice, { UserSlice } from './userSlice';
import createWebRTCSlice, { WebRTCSlice } from './webRTCSlice';

enableMapSet();

export type AppState = UserSlice & PianoSlice & WebRTCSlice;

export type AppSlice<T> = (set: SetState<AppState>, get: GetState<AppState>) => T;

/**
 * 슬라이스를 각각 생성하여 모두 합친 스토어를 만듦.
 */
const useStore = create<AppState>((set, get) => ({
  ...createUserSlice(set, get),
  ...createPianoSlice(set, get),
  ...createWebRTCSlice(set, get),
}));

if (isDev() && typeof window !== 'undefined') {
  /**
   * simple-zustand-devtool 의 타입과 store의 타입이 다르지만, 동작에는 문제가 없으므로 이렇게 해둠.
   * 그리고 Next.js 서버에서 먼저 한 번 실행되는데, 서버에는 window가 없으므로 이렇게 해둠.
   */
  // @ts-ignore
  mountStoreDevtool('Store', useStore);
}

export default useStore;
