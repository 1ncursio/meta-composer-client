import Player from '@lib/midi/Player';
import React, { FC, useCallback } from 'react';

export interface XRToolbarProps {
  onOpenSheet: () => void;
}

const XRToolbar: FC<XRToolbarProps> = ({ onOpenSheet }) => {
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

  return (
    <div className="flex-1 flex">
      <button onClick={onOpenSheet} className="btn">
        악보 검색
      </button>
      <input type="file" onChange={onLoadMIDI} accept=".mid, .midi" />
    </div>
  );
};

export default XRToolbar;
