import Peer from "simple-peer";
export default interface Peers {
  [key: string]: Peer.Instance;
}
