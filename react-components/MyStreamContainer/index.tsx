import { css } from '@emotion/react';
import useUserSWR from '@hooks/swr/useUserSWR';
import useStore from '@store/useStore';
import React, { useEffect, useRef } from 'react';
import { ControlledPiano, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

// const firstNote: number = MidiNumbers.fromNote('a0');
const firstNote: number = MidiNumbers.fromNote('e1');
// const lastNote: number = MidiNumbers.fromNote('c8');
const lastNote: number = MidiNumbers.fromNote('g7');

const MyStreamContainer = () => {
  const { data: userData } = useUserSWR();
  const { getMedia, peers } = useStore((state) => state.webRTC);
  const { pressedKeys, addPressedKey, removePressedKey } = useStore((state) => state.piano);

  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  const onPlayNoteInput = (midiNumber: number) => {
    addPressedKey(midiNumber);
    if (!userData) return;

    const data = JSON.stringify({
      type: 'noteOn',
      note: midiNumber,
    });
    const peer = peers[parseInt(Object.keys(peers).filter((key) => key !== userData.id.toString())[0])];
    if (peer) {
      console.log('상대방 피어 찾아서 midi 전송', { peer });
    } else {
      console.log('상대방 피어 못찾음');
    }
    peer.send(data);
  };

  useEffect(() => {
    if (myVideoRef.current) {
      getMedia(myVideoRef.current);
    }
  }, [myVideoRef.current]);

  return (
    <div className="h-full flex-1">
      <div
        // className="w-full 2xl:h-36 xl:h-32 lg:h-28 md:h-24 h-20"
        className="w-full h-24"
      >
        <ControlledPiano
          noteRange={{ first: firstNote, last: lastNote }}
          activeNotes={Array.from(pressedKeys)}
          playNote={() => {}}
          stopNote={() => {}}
          onPlayNoteInput={onPlayNoteInput}
          onStopNoteInput={removePressedKey}
          // keyWidthToHeight={0.5}
          css={pianoStyle}
        />
      </div>
      <video
        autoPlay
        // muted
        playsInline
        ref={myVideoRef}
        width="100%"
        onClick={() => {
          console.log('click');
        }}
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

export default MyStreamContainer;
