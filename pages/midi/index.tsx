import Player from '@lib/midi/Player';
import React, { useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const SheetContainer = dynamic(() => import('@react-components/SheetContainer'), { ssr: false });

const MIDIPage = () => {
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

  const onClickPlaySong = () => {
    Player.getInstance().startPlay();
  };

  const onClickPauseSong = () => {
    Player.getInstance().pause();
  };

  const onClickStopSong = () => {
    Player.getInstance().stop();
  };

  const onClickGetVolume = () => {
    console.log(Player.getInstance().volume);
  };

  return (
    <div>
      <input type="file" onChange={onLoadMIDI} accept=".mid, .midi" />
      {/* <audio src="/assets/audio/metronome/1.wav" /> */}
      <button onClick={onClickPlaySong}>플레이</button>
      <button onClick={onClickPauseSong}>일시정지</button>
      <button onClick={onClickStopSong}>처음부터</button>
      <button onClick={onClickGetVolume}>볼륨 얻기</button>
      <SheetContainer />
    </div>
  );
};

export default MIDIPage;
