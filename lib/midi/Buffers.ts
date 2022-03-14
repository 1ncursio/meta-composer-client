import CONST from './CONST';

export interface Buffers {
  [soundfontName: string]: {
    [instrument: string]: {
      [noteKey: string]: AudioBuffer;
    };
  };
}

const buffers: Buffers = {};
export const getBuffers = () => {
  return buffers;
};

export const getBufferForNote = (soundfontName: string, instrument: string, noteNumber: number) => {
  let noteKey = CONST.MIDI_NOTE_TO_KEY[noteNumber + 21];

  // TODO: 에러나면 수정
  // let buffer;

  // try {
  //   buffer = buffers[soundfontName][instrument][noteKey];
  // } catch (e) {
  //   console.error(e);
  // }
  // return buffer;

  return buffers[soundfontName][instrument][noteKey];
};

export const hasBuffer = (soundfontName: string, instrument: string) =>
  buffers.hasOwnProperty(soundfontName) && buffers[soundfontName].hasOwnProperty(instrument);

export const setBuffer = (soundfontName: string, instrument: string, noteKey: number, buffer: AudioBuffer) => {
  if (!buffers.hasOwnProperty(soundfontName)) {
    buffers[soundfontName] = {};
  }
  if (!buffers[soundfontName].hasOwnProperty(instrument)) {
    buffers[soundfontName][instrument] = {};
  }
  buffers[soundfontName][instrument][noteKey] = buffer;
};
