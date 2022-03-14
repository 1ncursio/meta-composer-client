export interface BaseMidiEvent {
  /* 이벤트의 타입 */
  type: MidiEventType;
  /* 이벤트의 지속시간 */
  deltaTime: number;
  timestamp: number;
  /* 이벤트 분포하면서 0부터 매김. Song의 idCounter을 이용해서 할당. 편의상 여기에 선언함. 아직 id로 하는 작업은 없다. */
  id: number;
  temporalDelta: number;
}

/* midi meta events */

export interface BaseMidiMetaEvent extends BaseMidiEvent {
  type: MidiMetaEventType;
  /* 메타 이벤트일 경우 무조건 meta 프로퍼티가 true인 상태로 존재함. */
  meta: true;
}

export interface MidiMetaSequenceNumberEvent extends BaseMidiMetaEvent {
  type: 'sequenceNumber';
  /* TODO: 시퀀스 넘버가 뭔지 모르겠음. */
  number: number;
}

export interface MidiMetaTextEvent extends BaseMidiMetaEvent {
  type: 'text';
  text: string;
}

export interface MidiMetaCopyrightNoticeEvent extends BaseMidiMetaEvent {
  type: 'copyrightNotice';
  text: string;
}

export interface MidiMetaTrackNameEvent extends BaseMidiMetaEvent {
  type: 'trackName';
  text: string;
}

export interface MidiMetaInstrumentNameEvent extends BaseMidiMetaEvent {
  type: 'instrumentName';
  text: string;
}

export interface MidiMetaLyricsEvent extends BaseMidiMetaEvent {
  type: 'lyrics';
  text: string;
}

export interface MidiMetaMarkerEvent extends BaseMidiMetaEvent {
  type: 'marker';
  text: string;
}

export interface MidiMetaCuePointEvent extends BaseMidiMetaEvent {
  type: 'cuePoint';
  text: string;
}

export interface MidiMetaChannelPrefixEvent extends BaseMidiMetaEvent {
  type: 'channelPrefix';
  channel: number;
}

export interface MidiMetaPortPrefixEvent extends BaseMidiMetaEvent {
  type: 'portPrefix';
  port: number;
}

export interface MidiMetaEndOfTrackEvent extends BaseMidiMetaEvent {
  type: 'endOfTrack';
}

export interface MidiMetaSetTempoEvent extends BaseMidiMetaEvent {
  type: 'setTempo';
  microsecondsPerBeat: number;
}

/** MTrk의 SMPTE 시작 시간(시, 분, 초, 프레임, 서브프레임)을 지정함. */
export interface MidiMetaSMPTEOffsetEvent extends BaseMidiMetaEvent {
  type: 'smpteOffset';
  frameRate: number;
  hour: number;
  min: number;
  sec: number;
  frame: number;
  subframe: number;
}

export interface MidiMetaTimeSignatureEvent extends BaseMidiMetaEvent {
  type: 'timeSignature';
  numerator: number;
  denominator: number;
  metronome: number;
  thirtySeconds: number;
}

export interface MidiMetaKeySignatureEvent extends BaseMidiMetaEvent {
  type: 'keySignature';
  key: number;
  /* 0이면 메이저 스케일, 아니면 마이너 스케일 */
  scale: number;
}

export interface MidiMetaSequencerSpecificEvent extends BaseMidiMetaEvent {
  type: 'sequencerSpecific';
  data: Uint8Array;
}

export interface MidiMetaUnknownMetaEvent extends BaseMidiMetaEvent {
  type: 'unknownMeta';
  data: Uint8Array;
  metatypeByte: number;
}

/* midi system events */

export interface BaseMidiSystemEvent extends BaseMidiEvent {
  type: MidiSystemEventType;
  data: Uint8Array;
}

export interface MidiSystemSysExEvent extends BaseMidiSystemEvent {
  type: 'sysEx';
  data: Uint8Array;
}

export interface MidiSystemEndSysExEvent extends BaseMidiSystemEvent {
  type: 'endSysEx';
  data: Uint8Array;
}

/* midi channel events */

export interface BaseMidiChannelEvent extends BaseMidiEvent {
  type: MidiChannelEventType;
  /* 이벤트가 발생한 채널의 일련번호 */
  channel: number;
  channelVolume: number;
}

export interface BaseMidiChannelNoteEvent extends BaseMidiChannelEvent {
  type: 'noteOn' | 'noteOff' | 'noteAftertouch';
  /* note number은 midi note number - 21과 같음 */
  noteNumber: number;
  midiNoteNumber: number;
}

export interface MidiChannelNoteOnEvent extends BaseMidiChannelNoteEvent {
  type: 'noteOn';
  instrument: string;
  velocity: number;
}

export interface MidiChannelNoteOffEvent extends BaseMidiChannelNoteEvent {
  type: 'noteOff';
  instrument: string;
  velocity: number;
  byte9: true;
}

export interface MidiChannelNoteAftertouchEvent extends BaseMidiChannelNoteEvent {
  type: 'noteAftertouch';
  amount: number;
}

export interface MidiChannelControllerEvent extends BaseMidiChannelEvent {
  type: 'controller';
  controllerType: number;
  value: number;
}

export interface MidiChannelProgramChangeEvent extends BaseMidiChannelEvent {
  type: 'programChange';
  programNumber: number;
}

export interface MidiChannelChannelAftertouchEvent extends BaseMidiChannelEvent {
  type: 'channelAftertouch';
  amount: number;
}

export interface MidiChannelPitchBendEvent extends BaseMidiChannelEvent {
  type: 'pitchBend';
  value: number;
}

/* 모든 메타 이벤트 */
export type MidiMetaEvent =
  | MidiMetaSequenceNumberEvent
  | MidiMetaTextEvent
  | MidiMetaCopyrightNoticeEvent
  | MidiMetaTrackNameEvent
  | MidiMetaInstrumentNameEvent
  | MidiMetaLyricsEvent
  | MidiMetaMarkerEvent
  | MidiMetaCuePointEvent
  | MidiMetaChannelPrefixEvent
  | MidiMetaPortPrefixEvent
  | MidiMetaEndOfTrackEvent
  | MidiMetaSetTempoEvent
  | MidiMetaSMPTEOffsetEvent
  | MidiMetaTimeSignatureEvent
  | MidiMetaKeySignatureEvent
  | MidiMetaSequencerSpecificEvent
  | MidiMetaUnknownMetaEvent;

/* 모든 시스템 이벤트 */
export type MidiSystemEvent = MidiSystemSysExEvent | MidiSystemEndSysExEvent;

/* 모든 채널 이벤트 */
export type MidiChannelEvent =
  | MidiChannelNoteOnEvent
  | MidiChannelNoteOffEvent
  | MidiChannelNoteAftertouchEvent
  | MidiChannelControllerEvent
  | MidiChannelProgramChangeEvent
  | MidiChannelChannelAftertouchEvent
  | MidiChannelPitchBendEvent;

/* 모든 노트 이벤트 */
export type MidiChannelNoteEvent = MidiChannelNoteOnEvent | MidiChannelNoteOffEvent | MidiChannelNoteAftertouchEvent;

/* 트랙내에서의 모든 미디 이벤트 */
export type MidiEvent = MidiMetaEvent | MidiSystemEvent | MidiChannelEvent;

export type MidiSystemEventType = 'sysEx' | 'endSysEx';
export type MidiMetaEventType =
  | 'sequenceNumber'
  | 'text'
  | 'copyrightNotice'
  | 'trackName'
  | 'instrumentName'
  | 'lyrics'
  | 'marker'
  | 'cuePoint'
  | 'channelPrefix'
  | 'portPrefix'
  | 'endOfTrack'
  | 'setTempo'
  | 'smpteOffset'
  | 'timeSignature'
  | 'keySignature'
  | 'sequencerSpecific'
  | 'unknownMeta';
// export type MidiSystemAndMetaEventType = MidiSystemEventType | MidiMetaEventType;
export type MidiChannelEventType =
  /* 노트 끄기 */
  | 'noteOff'
  /* 노트 켜기 */
  | 'noteOn'
  /* 눌려진 노트의 압력 변경(특정 음의 추가 표현에 사용되며, 악기의 서스테인 단계 동안 일부 유형의 변조를 적용하거나 증가시킴) */
  | 'noteAftertouch'
  /* MIDI 채널 상태의 변경 이벤트. 채널에는 볼륨, 팬, 변조, 효과 등을 포함한 128개의 컨트롤러가 있음. */
  | 'controller'
  /* MIDI 채널에서 재생할 프로그램(악기, patch)를 변경하는 이벤트 */
  | 'programChange'
  /**
   * 채널 애프터터치 이벤트는 특정 MIDI 채널에서 현재 눌러진 모든 키에 영향을 미친다는 점을 제외하고는 note after touch 이벤트와 유사함.
   * (0 = 압력 없음, 127 = 전체 압력)이라는 매개변수 하나만 사용함.
   * */
  | 'channelAftertouch'
  /**
   * 컨트롤러 이벤트와 유사하지만, 값을 표현하기 위한 2바이트를 포함한 고유한 MIDI 이벤트.
   * 0~16383의 값이 가능하며, 8192 미만의 값은 피치를 낮추고 8192 이상은 피치를 높인다.
   * 피치 범위는 악기마다 다를 수 있지만 일반적으로 +/-2 가 반음이다. 이 프로젝트의 파서에서는 기본값이 0임.
   *  */
  | 'pitchBend';
export type MidiEventType = MidiSystemEventType | MidiMetaEventType | MidiChannelEventType;
