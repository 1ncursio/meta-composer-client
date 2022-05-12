export interface IRoundedNote {
  timestamp: number;
  duration: number;
  midiNoteNumber: number;
}

/**
 * SheetGenerator 에서 쓰일 RoundedNote 클래스.
 */
export default class RoundedNote {
  trackIndex: number;
  note: IRoundedNote;
  numerator: number;
  denom: number;
  dotted: boolean;
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
