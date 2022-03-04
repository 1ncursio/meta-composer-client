import Peer from 'simple-peer';
import IUser from './IUser';

export default interface Peers {
  [userId: IUser['id']]: Peer.Instance;
}
