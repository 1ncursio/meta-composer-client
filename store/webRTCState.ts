import Peers from '../typings/Peers';
import Peer from 'simple-peer';
import IUser from '../typings/IUser';

export interface WebRTCState {
  peers: Peers;
  resetPeers: () => void;
  addPeer: (userId: IUser['id'], peer: Peer.Instance) => void;
  removePeer: (userId: IUser['id']) => void;
}
