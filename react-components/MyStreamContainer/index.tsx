import { css } from '@emotion/react';
import useUserSWR from '@hooks/swr/useUserSWR';
import { INoteEvent } from '@lib/midi/NoteEvent';
import { useMIDI, useMIDIMessage } from '@react-midi/hooks';
import useStore from '@store/useStore';
import MIDImessage from 'midimessage';
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
  const { hasMIDI, inputs } = useMIDI();
  const message = useMIDIMessage(inputs[0]);

  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  const onPlayNoteInput = (midiNumber: number) => {
    addPressedKey(midiNumber);
    if (!userData) return;

    const data = JSON.stringify({
      type: 'noteOn',
      note: midiNumber,
    });
    const peer = peers[userData.id];
    if (peer) {
      console.log('상대방 피어 찾아서 midi 전송', { peer });
    } else {
      console.log('상대방 피어 못찾음');
    }
    peer.send(data);
  };

  const onStopNoteInput = (midiNumber: number) => {
    removePressedKey(midiNumber);
    if (!userData) return;

    const data = JSON.stringify({
      type: 'noteOff',
      note: midiNumber,
    });
    const peer = peers[userData.id];
    if (peer) {
      console.log('상대방 피어 찾아서 midi 전송', { peer });
    } else {
      console.log('상대방 피어 못찾음');
    }
    peer.send(data);
  };

  useEffect(() => {
    // 로그인해야 미디이벤트 받을 수 있음
    if (message && userData) {
      const midiMessage = new MIDImessage(message);

      switch (midiMessage.messageType) {
        case 'noteon':
          addPressedKey(midiMessage.key);

          const data: INoteEvent = {
            type: 'noteOn',
            note: midiMessage.key,
            velocity: midiMessage.velocity,
          };

          console.log(data);
          peers[userData.id]?.send(JSON.stringify(data));

          break;
        case 'noteoff':
          if (pressedKeys.has(midiMessage.key)) {
            removePressedKey(midiMessage.key);

            const data: INoteEvent = {
              type: 'noteOff',
              note: midiMessage.key,
              velocity: midiMessage?.velocity ?? 0,
            };

            console.log(data);
            peers[userData.id]?.send(JSON.stringify(data));
          }
          break;
        default:
          break;
      }
    }
  }, [message]);

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
          onStopNoteInput={onStopNoteInput}
          // keyWidthToHeight={0.5}
          css={pianoStyle}
        />
      </div>
      <video
        autoPlay
        muted
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
