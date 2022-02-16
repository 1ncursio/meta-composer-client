import Peers from '../typings/Peers';
import Peer from 'simple-peer';

export interface WebRTCState {
  peers: Peers;
  resetPeers: () => void;
  addPeer: (peer: Peer.Instance) => void;
  removePeer: (peer: Peer.Instance) => void;
}

// const
