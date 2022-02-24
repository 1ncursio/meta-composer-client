import { css } from '@emotion/react';
import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import MIDImessage from 'midimessage';
import { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import { ControlledPiano, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import useStore from '../../store';
import * as styles from './styles';

export interface RoomEntryContainerProps {
  isOculus: boolean;
}

const RoomEntryContainer: FC<RoomEntryContainerProps> = ({ isOculus }) => {
  const [selected, setSelected] = useState(0);
  const [rendered, setRendered] = useState(false);
  const { hasMIDI, inputs } = useMIDI();
  const message = useMIDIMessage(inputs[selected]);
  const { pressedKeys, addPressedKey, removePressedKey } = useStore((state) => state.piano);

  const firstNote = MidiNumbers.fromNote('a0');
  const lastNote = MidiNumbers.fromNote('c8');

  const handleChangeSelect = useCallback(
    (e) => {
      setSelected(e.target.value);
      console.log(selected);
    },
    [selected],
  );

  // midimessage 발생했을 때 실행
  useEffect(() => {
    if (message) {
      const midiMessage = new MIDImessage(message);

      switch (midiMessage.messageType) {
        case 'noteon':
          addPressedKey(midiMessage.key);
          break;
        case 'noteoff':
          removePressedKey(midiMessage.key);
          break;
        default:
          break;
      }
    }
  }, [message]);

  useLayoutEffect(() => {
    setRendered(true);
  }, []);

  if (rendered && !isOculus && !hasMIDI) {
    return <div className="text-sm">Web MIDI API를 지원하지 않는 브라우저입니다. 다른 브라우저를 사용해 보세요.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 h-96">
      <div className="inline-flex justify-center">
        <AiOutlineDesktop size={128} className={styles.icon(isOculus)} />
        <BsBadgeVr size={128} className={styles.icon(!isOculus)} />
      </div>
      <select
        onChange={handleChangeSelect}
        value={selected}
        className="select select-primary select-bordered focus:outline-none select-sm w-full rounded-sm max-w-xs"
      >
        {inputs.length > 0 ? (
          inputs.map((input, index) => (
            <option key={index} value={index}>
              {`🎹 ${input.name}`}
            </option>
          ))
        ) : (
          <option>No MIDI devices found</option>
        )}
      </select>
      {inputs.length > 0 ? (
        <h3>MIDI 키보드가 연결되었습니다! 오큘러스에 접속하기 전에 미리 테스트해 보세요.</h3>
      ) : (
        <h3>감지된 MIDI 키보드가 없습니다. MIDI 키보드를 연결해 주세요.</h3>
      )}

      <ControlledPiano
        noteRange={{ first: firstNote, last: lastNote }}
        activeNotes={Array.from(pressedKeys)}
        playNote={() => {}}
        stopNote={() => {}}
        onPlayNoteInput={() => {}}
        onStopNoteInput={() => {}}
        css={pianoStyle}
      />
    </div>
  );
};

const pianoStyle = css`
  .ReactPiano__Key--active {
    background: #f59e0b; /* Change the default active key color to bright red */
  }

  .ReactPiano__Key--accidental {
    /* background: #00f; Change accidental keys to be completely black */
  }

  .ReactPiano__Key--natural {
    /* background: #fff; */
    /* border: none; */
    border-radius: 0;
  }

  /* 눌린 상태인 흰 건반 */
  .ReactPiano__Key--active.ReactPiano__Key--natural {
    border: 1px solid #c27d08;
  }
`;

export default RoomEntryContainer;
