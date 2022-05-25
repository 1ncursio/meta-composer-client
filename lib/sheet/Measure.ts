import { MidiChannelSongNoteEvent } from '@lib/midi/Song';
import { MidiMetaKeySignatureEvent } from '@typings/MidiEvent';
import RoundedNote from './RoundedNote';
// {
//     "0": {},
//     "1": {}
// }

export interface RoundedNotes {
  [trackIndex: string]: {
    [timestamp: number]: RoundedNote;
  };
}

export interface Divs {
  [key: string]: HTMLDivElement;
}

export interface Stave {
  clef: string;
  space_above_staff_ln: number;
  spacing_between_lines_px: number;
}

export interface Staves {
  [key: string]: Stave;
}

//Class to save the finished, rendered Measures. obj.canvases will be generated after all measures are rendered in VF. Otherwise bounds won't yet be calculated correctly
export default class Measure {
  divs?: Divs;
  staves: Staves;
  measureWidth: number;
  // roundedNotes: MidiChannelSongNoteEvent;
  roundedNotes: RoundedNotes;
  startTsp: number;
  endTsp: number;
  msDuration: number;
  keySignature: MidiMetaKeySignatureEvent;
  keySignatureName: string;
  cumulativeXPosition: number;
  isFirstInRow: boolean;
  canvases: {};
  div: any;
  [key: string]: any;

  constructor(
    divs: Divs,
    staves: Staves,
    measureWidth: number,
    roundedNotes: RoundedNotes,
    startTsp: number,
    endTsp: number,
    msDuration: number,
    keySignature: MidiMetaKeySignatureEvent,
    keySignatureName: string,
    cumulativeXPosition: number,
    isFirstInRow: boolean,
  ) {
    this.divs = divs;

    this.staves = staves;
    this.measureWidth = measureWidth;
    this.roundedNotes = roundedNotes;
    this.startTsp = startTsp;
    this.endTsp = endTsp;
    this.msDuration = msDuration;
    this.keySignature = keySignature;
    this.keySignatureName = keySignatureName;
    this.cumulativeXPosition = cumulativeXPosition;
    this.isFirstInRow = isFirstInRow;
  }
}
