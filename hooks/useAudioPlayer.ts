import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

const useAudioPlayer = () => {
  const [, setRendered] = useState(false);

  const context = useRef<AudioContext | null>(null);
  const buffers = useRef<{ [key: string]: AudioBuffer }>({});
  const audioNotes = useRef<never[]>([]);
  const convolverNode = useRef<ConvolverNode | null>(null);
  const soundfontName = useRef('MusyungKite');
  const metronomSound1 = useRef<AudioBuffer | null>(null);
  const metronomSound2 = useRef<AudioBuffer | null>(null);

  const loadMetronomeSounds = useCallback(async () => {
    const { data: data1 } = await axios.get('/assets/audio/metronome/1.wav', {
      responseType: 'arraybuffer',
    });
    const { data: data2 } = await axios.get('/assets/audio/metronome/2.wav', {
      responseType: 'arraybuffer',
    });

    if (context.current) {
      context.current.decodeAudioData(
        data1,
        (data) => {
          metronomSound1.current = data;
        },
        (err) => {
          console.error(err);
        },
      );

      context.current.decodeAudioData(
        data2,
        (data) => {
          metronomSound2.current = data;
        },
        (err) => {
          console.error(err);
        },
      );
    }
  }, [context]);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      context.current = new AudioContext();
      buffers.current = {};
      audioNotes.current = [];
      soundfontName.current = 'MusyungKite';
      convolverNode.current = context.current.createConvolver();

      loadMetronomeSounds();
    }
  }, [setRendered]);

  return {
    context: context.current,
    buffers: buffers.current,
    audioNotes: audioNotes.current,
    convolverNode: convolverNode.current,
    soundfontName: soundfontName.current,
    metronomSound1: metronomSound1.current,
    metronomSound2: metronomSound2.current,
  };
};

export default useAudioPlayer;
