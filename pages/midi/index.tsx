import MidiLoader from '@lib/midi/MidiLoader';
import Player from '@lib/midi/Player';
import React, { useCallback, useEffect } from 'react';
import useAudioPlayer from '~/hooks/useAudioPlayer';

const MIDIPage = () => {
  const { context, metronomSound1, metronomSound2 } = useAudioPlayer();
  //   const player = new Player();

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

  useEffect(() => {
    if (context) {
      console.log('context', context);
    }
  }, [context]);

  return (
    <div>
      <input type="file" onChange={onLoadMIDI} accept=".mid, .midi" />
      <audio src="/assets/audio/metronome/1.wav" />
      {JSON.stringify(context)}
    </div>
  );
};

export default MIDIPage;
