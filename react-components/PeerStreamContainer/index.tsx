import { css } from '@emotion/react';
import useStore from '@store/useStore';
import React, { forwardRef } from 'react';
import { ControlledPiano, MidiNumbers } from 'react-piano';

const firstNote: number = MidiNumbers.fromNote('e1');
const lastNote: number = MidiNumbers.fromNote('g7');

const PeerStreamContainer = forwardRef<HTMLVideoElement>((props, peerVideoRef) => {
  const { peerPressedKeys, addPeerPressedKey, removePeerPressedKey } = useStore((state) => state.piano);

  return (
    <div className="h-full flex-1">
      <div className="w-full h-24">
        <ControlledPiano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={Array.from(peerPressedKeys)}
          playNote={() => {}}
          stopNote={() => {}}
          onPlayNoteInput={addPeerPressedKey}
          onStopNoteInput={removePeerPressedKey}
          keyWidthToHeight={0.5}
          css={pianoStyle}
        />
        <video
          autoPlay
          muted
          playsInline
          width="100%"
          ref={peerVideoRef}
          onClick={() => {
            console.log('click');
          }}
        />
      </div>
    </div>
  );
});

const pianoStyle = css`
  .ReactPiano__Key--active {
    background: #22d3ee; /* Change the default active key color to bright red */
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

PeerStreamContainer.displayName = 'PeerStreamContainer';

export default PeerStreamContainer;
