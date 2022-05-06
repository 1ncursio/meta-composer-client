import useStore from '@store/useStore';
import React, { useMemo } from 'react';
import { BsCameraVideoFill, BsCameraVideoOffFill, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { MdPiano, MdPianoOff } from 'react-icons/md';
import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import * as styles from './styles';

const StreamControlContainer = () => {
  const { inputs, hasMIDI } = useMIDI();
  const { isMicMuted, isCameraOff, toggleMicState, toggleCameraState } = useStore((state) => state.webRTC);

  const isMidiConnected = useMemo(() => inputs.length > 0, [inputs]);

  return (
    <div className="flex gap-4 p-2 py-8 justify-center">
      <div
        className="tooltip tooltip-open tooltip-warning"
        data-tip={!isMidiConnected ? 'MIDI 연결 필요' : 'MIDI 연결 완료'}
      >
        <button className={styles.stateControlButton(isMidiConnected)}>
          {isMidiConnected ? <MdPianoOff size={28} /> : <MdPiano size={28} />}
        </button>
      </div>
      <div className="tooltip" data-tip={isCameraOff ? '카메라 켜기' : '카메라 끄기'}>
        <button onClick={toggleCameraState} className={styles.stateControlButton(!isCameraOff)}>
          {isCameraOff ? <BsCameraVideoOffFill size={24} /> : <BsCameraVideoFill size={24} />}
        </button>
      </div>
      <div className="tooltip" data-tip={isMicMuted ? '음소거 해제' : '음소거'}>
        <button onClick={toggleMicState} className={styles.stateControlButton(!isMicMuted)}>
          {isMicMuted ? <BsMicMuteFill size={24} /> : <BsMicFill size={24} />}
        </button>
      </div>
    </div>
  );
};

export default StreamControlContainer;
