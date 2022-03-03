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
      console.log('loaded midiFile');
    };
    reader.readAsDataURL(file);
  }, []);

  const onLoadMIDI = useCallback(
    (e) => {
      e.preventDefault();
      const files = e.target.files;

      for (let i = 0; i < files.length; i++) {
        readMIDIFile(files[i]);
      }
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
      <input type="file" onChange={onLoadMIDI} />
      <audio src="/assets/audio/metronome/1.wav" />
      {JSON.stringify(context)}
    </div>
  );
};

export default MIDIPage;
