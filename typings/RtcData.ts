export default interface RtcData {
  data: {
    sdp: string;
    type: 'answer' | 'offer' | 'pranswer' | 'rollback';
  };
}
