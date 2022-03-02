import Peers from '../typings/Peers';
import Peer from 'simple-peer';
import IUser from '../typings/IUser';
import { AppSlice } from './useStore';
import produce from 'immer';

export interface WebRTCSlice {
  webRTC: {
    peers: Peers;
    resetPeers: () => void;
    addPeer: (userId: IUser['id'], peer: Peer.Instance) => void;
    removePeer: (userId: IUser['id']) => void;
  };
}

const createWebRTCSlice: AppSlice<WebRTCSlice> = (set, get) => ({
  webRTC: {
    peers: {},
    resetPeers: () => {
      set(
        produce((state) => {
          state.webRTC.peers = {};
        }),
      );
    },
    addPeer: (userId, peer) => {
      set(
        produce((state) => {
          state.webRTC.peers[userId] = peer;
        }),
      );
    },
    removePeer: (userId) => {
      set(
        produce((state) => {
          delete state.webRTC.peers[userId];
        }),
      );
    },
  },
});

export default createWebRTCSlice;
