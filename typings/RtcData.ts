export default interface RtcData {
  sdp: string;
  type: 'answer' | 'offer' | 'pranswer' | 'rollback';
}
