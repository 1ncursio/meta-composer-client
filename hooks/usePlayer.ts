import { useEffect, useRef } from 'react';

const usePlayer = (midiData, fileName: string, name?: string, copyright?: string, onready) => {
  //   this.fileName = fileName;
  //   this.name = name || fileName;
  //   this.copyright = copyright || '';
  //   this.onready = onready;
  //   this.text = [];
  //   this.timeSignatures;
  //   this.keySignatures;
  //   this.notesBySeconds = {};
  //   this.controlEvents = [];
  //   this.temporalData = midiData.temporalData;
  //   this.sustainsByChannelAndSecond = midiData.temporalData.sustainsByChannelAndSecond;

  //   this.header = midiData.header;
  //   this.tracks = midiData.tracks;
  //   this.markers = [];
  //   this.otherTracks = [];
  //   this.activeTracks = [];
  //   this.microSecondsPerBeat = 10;
  //   this.channels = this.getDefaultChannels();
  //   this.idCounter = 0;

  //   this.processEvents(midiData);

  const nameRef = useRef<string | undefined>(name);
  const copyrightRef = useRef<string | undefined>(copyright);
  const onReady = onready;
  const text = useRef([]);
  const timeSignatures = useRef([]);
  const keySignatures = useRef([]);
  const notesBySeconds = useRef({});
  const controlEvents = useRef([]);
  const temporalData = useRef(midiData.temporalData);
  const sustainsByChannelAndSecond = useRef(midiData.temporalData.sustainsByChannelAndSecond);

  const header = useRef(midiData.header);
  const tracks = useRef(midiData.tracks);
  const markers = useRef([]);
  const otherTracks = useRef([]);
  const activeTracks = useRef([]);
  const microSecondsPerBeat = useRef(10);
  const channels = useRef(this.getDefaultChannels());
  const idCounter = useRef(0);

  const clear = () => {};
  const getStart = () => {
    return 1;
  };
  const getEnd = () => {};
  const setSong = (song: any) => {};
  const processEvents = (midiData) => {};

  useEffect(() => {
    processEvents(midiData);
  });

  return {};
};

export default usePlayer;
