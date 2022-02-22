import { css } from '@emotion/react';
import { useMIDI } from '@react-midi/hooks';
import { FC, useEffect } from 'react';
import { AiOutlineDesktop } from 'react-icons/ai';
import { BsBadgeVr } from 'react-icons/bs';
import { MidiNumbers, Piano } from 'react-piano';
import 'react-piano/dist/styles.css';
import * as styles from './styles';

export interface RoomEntryContainerProps {
  isOculus: boolean;
}

const RoomEntryContainer: FC<RoomEntryContainerProps> = ({ isOculus }) => {
  const { hasMIDI, inputs, outputs } = useMIDI();

  const firstNote = MidiNumbers.fromNote('a0');
  const lastNote = MidiNumbers.fromNote('c8');
  //   const keyboardShortcuts = KeyboardShortcuts.create({
  //     firstNote: firstNote,
  //     lastNote: lastNote,
  //   });

  useEffect(() => {
    if (hasMIDI) {
      console.log({ inputs, outputs });
    }
  }, [hasMIDI, inputs, outputs]);

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex justify-center">
        <AiOutlineDesktop size={128} className={styles.icon(isOculus)} />
        <BsBadgeVr size={128} className={styles.icon(!isOculus)} />
      </div>
      <select className="select select-primary select-bordered focus:outline-none select-sm w-full rounded-sm max-w-[10rem]">
        {inputs.map((input, index) => (
          <option key={index} value={index}>
            {`🎹 ${input.name}`}
          </option>
        ))}
      </select>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={() => {
          // Play a given note - see notes below
        }}
        stopNote={() => {
          // Stop playing a given note - see notes below
        }}
        width={1400}
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
    background: #00f; /* Change accidental keys to be completely black */
  }

  .ReactPiano__Key--natural {
    background: #fff;
    border-radius: 0;
  }
`;

export default RoomEntryContainer;
