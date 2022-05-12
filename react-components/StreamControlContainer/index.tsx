import Player from '@lib/midi/Player';
import { useMIDI } from '@react-midi/hooks';
import useStore from '@store/useStore';
import React, { useCallback, useMemo, useRef } from 'react';
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFileMusic, BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { MdPiano, MdPianoOff } from 'react-icons/md';
import * as styles from './styles';

const StreamControlContainer = () => {
  const { inputs, hasMIDI } = useMIDI();
  const { isMicMuted, isCameraOff, toggleMicState, toggleCameraState } = useStore((state) => state.webRTC);

  const inputMidiFileRef = useRef<HTMLInputElement>(null);

  const isMidiConnected = useMemo(() => inputs.length > 0, [inputs]);

  const readMIDIFile = useCallback((file: File) => {
    const reader = new FileReader();
    const { name: fileName } = file;

    reader.onload = (theFile) => {
      console.log({ result: reader.result, fileName });
      Player.getInstance().loadSong(reader.result as string, fileName);
      // MidiLoader.loadFile(reader.result as string).then((midiFile) => {
      //   console.log({ midiFile });
      // });
      console.log('loaded midiFile');
    };
    reader.readAsDataURL(file);
  }, []);

  const onLoadMIDI = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!e.target.files) return;

      Array.from(e.target.files).forEach((file) => readMIDIFile(file));
    },
    [readMIDIFile],
  );

  const onClickUploadMidiFile = useCallback(() => {
    if (!inputMidiFileRef.current) return;
    inputMidiFileRef.current.click();
  }, []);

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
      <div className="tooltip" data-tip="미디 파일 업로드">
        <button onClick={onClickUploadMidiFile} className={styles.stateControlButton(!isMicMuted)}>
          <BsFileMusic size={24} />
        </button>
        <input type="file" hidden onChange={onLoadMIDI} ref={inputMidiFileRef} accept=".mid, .midi" />
      </div>
    </div>
  );
};

export default StreamControlContainer;
