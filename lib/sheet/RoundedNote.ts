/**
 * SheetGenerator 에서 쓰일 RoundedNote 클래스.
 */

export interface IRoundedNote {
  timestamp: number;
  duration: number;
  midiNoteNumber: number;
}

export default class RoundedNote {
  trackIndex: number;
  note: any;
  numerator: number;
  denom: number;
  dotted: any;
  isRest: boolean;

  constructor(
    note: IRoundedNote,
    numerator: number,
    denom: number,
    dotted: boolean,
    isRest: boolean,
    trackIndex: number,
  ) {
    this.note = note;
    this.numerator = numerator;
    this.denom = denom;
    this.dotted = dotted;
    this.isRest = isRest;
    this.trackIndex = trackIndex;
  }
}
