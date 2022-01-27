import React, { useCallback } from 'react';
import SoundFont from 'soundfont-player';
import useMIDI from '../../hooks/useMIDI';

const PianoPage = () => {
  const { midi, midiInput, midiOutput, loading, pressedKeys, error, activateInstrument } = useMIDI();

  //   const onClickButton = useCallback(
  //     (e: React.MouseEvent<HTMLButtonElement>) => {
  //       if (!midi) return;
  //       SoundFont.instrument(new AudioContext(), 'acoustic_grand_piano').then((instrument) => {
  //         instrument.play('C4');
  //         midiInput.forEach((input) => {
  //           instrument.listenToMidi(input);
  //         });
  //       });
  //     },
  //     [midi, midiInput],
  //   );

  return (
    <div>
      <h1>{midi ? 'MIDI Ready' : 'MIDI Not Ready'}</h1>
      <div>{loading && <div>loading...</div>}</div>
      <div>
        {Array.from(pressedKeys).map((key) => (
          <div key={key}>{key}</div>
        ))}
        {error && <div>{error}</div>}
      </div>
      <button onClick={activateInstrument}>click me</button>
    </div>
  );
};

export default PianoPage;
