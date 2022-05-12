export interface INoteEvent {
  type: 'noteOn' | 'noteOff';
  note: number;
  velocity?: number;
}

export default class NoteEvent {
  public static NOTE_ON = 'noteOn';
  public static NOTE_OFF = 'noteOff';

  public readonly type: string;
  public readonly note: number;
  public readonly velocity: number;

  constructor(type: string, note: number, velocity: number) {
    this.type = type;
    this.note = note;
    this.velocity = velocity;
  }

  //   public toJSON(): string {
  //     return JSON.stringify(this);
  //   }

  //   public static fromJSON(json: string): NoteEvent {
  //     const data = JSON.parse(json);
  //     return new NoteEvent(data.type, data.note, data.velocity);
  //   }
}
