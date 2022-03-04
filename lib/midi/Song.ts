// import { CONST } from './data/CONST.js';
// import { getSetting } from './settings/Settings.js';
import CONST from './CONST.js';
import { SheetGenerator } from './sheet/SheetGenerator.js';
// import { getLoader } from './ui/Loader.js';

export interface TimeSignature {
  /* 박자의 분자 */
  numerator: number;
  /* 박자의 분모 */
  denominator: number;
  thirtyseconds: number;
  metronome: number;
}

export interface KeySignature {
  deltaTime: number;
  id: number;
  key: number;
  meta: boolean;
  scale: string;
  sharpsFlat: string;
  sharpsFlatSymbol: string;
  temporalDelta: number;
  timestamp: number;
  type: string;
}

export interface SustainPeriod {
  channel: string;
  end: number;
  start: number;
  value: number;
}

export interface SustainsByChannelAndSecond {
  [channel: string]: { [second: number]: SustainPeriod[] };
}

export interface SustainByChannelAndSecond {
  timestamp: number;
  isOn: boolean;
  value: number;
}

export interface Instruments {
  [key: string]: boolean;
}

export interface MidiChannel {
  instrument: number;
  mono: boolean;
  mute: boolean;
  omni: boolean;
  pitchBend: number;
  solo: boolean;
  volume: number;
  volumeControl: number;
}

export interface MidiChannels {
  [key: string]: MidiChannel;
}

export interface MidiNote {
  channel: number;
  channelVolume: number;
  deltaTime: number;
  duration: number;
  id: number;
  instrument: string;
  midiNoteNumber: number;
  noteNumber: number;
  offTime: number;
  offVelocity: number;
  sustainDuration: number;
  sustainOffTime: number;
  sustainOnTime: number;
  temporalDelta: number;
  timestamp: number;
  track: number;
  type: string;
  velocity: number;
}

export interface BPM {
  bpm: number;
  timestamp: number;
}

export interface BeatsBySecond {
  [key: number]: number[][];
}

export interface TemporalData {
  bpms: BPM[];
  beatsBySecond: BeatsBySecond;
  sustainsByChannelAndSecond: {
    // 채널
    [key: string]: {
      // 초
      [key: string]: {
        timestamp: number;
        isOn: boolean;
        value: number;
      };
    };
  };
  timeSignatures: any[];
  keySignatures: any[];
}

export interface MidiData {
  header: MidiHeader;
  tracks: MidiEvent[][];
  temporalData: TemporalData;
}

export interface MidiHeader {
  /* 포맷 */
  format: number;
  /* 트랙의 개수 */
  numTracks: number;
  /* 비트 당 틱의 수 */
  ticksPerBeat: number;
}
export type MidiSystemEvent = 'sysEx' | 'endSysEx';
export type MidiMetaEvent =
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
export type MidiSystemAndMetaEvent = MidiSystemEvent | MidiMetaEvent;
export type MidiChannelEvent =
  /* 노트 끄기 */
  | 'noteOff'
  /* 노트 켜기 */
  | 'noteOn'
  /* 눌려진 노트의 압력 변경(특정 음의 추가 표현에 사용되며, 악기의 서스테인 단계 동안 일부 유형의 변조를 적용하거나 증가시킴) */
  | 'noteAfterTouch'
  /* MIDI 채널 상태의 변경 이벤트. 채널에는 볼륨, 팬, 변조, 효과 등을 포함한 128개의 컨트롤러가 있음. */
  | 'controller'
  /* MIDI 채널에서 재생할 프로그램(악기, patch)를 변경하는 이벤트 */
  | 'programChange'
  /**
   * 채널 애프터터치 이벤트는 특정 MIDI 채널에서 현재 눌러진 모든 키에 영향을 미친다는 점을 제외하고는 note after touch 이벤트와 유사함.
   * (0 = 압력 없음, 127 = 전체 압력)이라는 매개변수 하나만 사용함.
   * */
  | 'channelAfterTouch'
  /**
   * 컨트롤러 이벤트와 유사하지만, 값을 표현하기 위한 2바이트를 포함한 고유한 MIDI 이벤트.
   * 0~16383의 값이 가능하며, 8192 미만의 값은 피치를 낮추고 8192 이상은 피치를 높인다.
   * 피치 범위는 악기마다 다를 수 있지만 일반적으로 +/-2 가 반음이다.
   *  */
  | 'pitchBend';
export type MidiEventType = MidiSystemAndMetaEvent | MidiChannelEvent;
// (local var) event: {
//     deltaTime: any;
//     meta: boolean;
//     type: string;
//     number: any;
//     text: any;
//     channel: any;
//     port: any;
//     microsecondsPerBeat: any;
//     frameRate: any;
//     hour: number;
//     min: any;
//     sec: any;
//     frame: any;
//     subFrame: any;
//     numerator: any;
//     ... 15 more ...;
//     programNumber: any;
// }
export interface MidiEvent {
  //   data: Uint8Array;
  //   deltaTime: number;
  //   meta: boolean;
  //   metatypeByte: number;
  //   temporalDelta: number;
  //   timestamp: number;
  //   type: MidiEventType;
  /* 이벤트의 지속시간 */
  deltaTime: number;
  /* 메타 이벤트인지 아닌지 */
  meta: boolean;
  /* 이벤트의 타입 */
  type: MidiEventType;
  /* 이벤트가 발생한 트랙의 일련번호 */
  number: number;
}

export interface ActiveTrack {
  // TODO: 악기 이름을 추가해야 함
  instrument: string;
  // TODO: meta 타입 추가해야 함
  meta: any;
  /* 트랙의 이름 e.g. Piano right */
  name: string;
}

export default class Song {
  /* 파일 이름 */
  fileName: string;
  /* 곡명 */
  name: string;
  /* 저작권 */
  copyright: string;
  onready: (song: Song) => void;
  text: string[];
  /* 박자표 */
  timeSignatures: TimeSignature[];
  keySignatures: KeySignature[];
  notesBySeconds: {};
  controlEvents: never[];
  temporalData: any;
  sustainsByChannelAndSecond: SustainByChannelAndSecond[];
  header: any;
  tracks: any;
  markers: never[];
  otherTracks: never[];
  activeTracks: ActiveTrack[];
  microSecondsPerBeat: number;
  channels: {};
  idCounter: number;
  end: number;
  smpteOffset: any;
  measureLines: any;
  sustainPeriods: SustainPeriod[];
  longNotes: any;
  ready: boolean;
  sheetGen: any;
  notesSequence: any;
  noteSequence: MidiNote[];

  constructor(midiData: MidiData, fileName: string, name: string, copyright: string, onready: (song: Song) => void) {
    this.fileName = fileName;
    this.name = name || fileName;
    this.copyright = copyright || '';
    this.onready = onready;
    this.text = [];
    this.timeSignatures = [];
    this.keySignatures = [];
    this.notesBySeconds = {};
    this.controlEvents = [];
    this.temporalData = midiData.temporalData;
    this.sustainsByChannelAndSecond = midiData.temporalData.sustainsByChannelAndSecond;

    this.header = midiData.header;
    this.tracks = midiData.tracks;
    this.markers = [];
    this.otherTracks = [];
    this.activeTracks = [];
    this.microSecondsPerBeat = 10;
    this.channels = getDefaultChannels();
    this.idCounter = 0;

    this.sustainPeriods = [];
    this.ready = false;
    this.noteSequence = [];

    this.end = 0;

    this.processEvents(midiData);
  }

  clear() {}

  /**
   * 노래가 시작하는 시간(ms)을 리턴함
   * @method getStart
   */
  getStart() {
    return this.getNoteSequence()[0].timestamp;
  }

  /**
   * 노래가 끝나는 시간(ms)을 리턴함
   * @method getEnd
   * */
  getEnd() {
    if (!this.end) {
      let noteSequence = this.getNoteSequence().sort((a, b) => a.offTime - b.offTime);
      let lastNote = noteSequence[noteSequence.length - 1];
      this.end = lastNote.offTime;
    }
    return this.end;
  }

  getOffset() {
    if (!this.smpteOffset) {
      return 0; //
    } else {
      return ((this.smpteOffset.hour * 60 + this.smpteOffset.min) * 60 + this.smpteOffset.sec) * 1000;
    }
  }

  getMeasureLines() {
    if (!this.measureLines) {
      this.setMeasureLines();
    }
    return this.measureLines;
  }

  /* TODO: 현재 첫번째 time signature만 반환함. 추후에 수정 */
  getTimeSignature(): TimeSignature {
    //TODO handle multple timesignature within a song
    if (this.timeSignatures instanceof Array) {
      return this.timeSignatures[0];
    }
    return {
      numerator: 4,
      denominator: 4,
      thirtyseconds: 8,
      metronome: 24,
    };
  }

  /* TODO: 현재 첫번째 key signature만 반환함. 추후에 수정 */
  getKeySignature() {
    if (this.keySignatures.length) {
      return this.keySignatures[0];
    }

    return {
      scale: 0,
      key: 0,
    };
  }
  setMeasureLines() {
    const timeSignature = this.getTimeSignature();

    const numerator = timeSignature.numerator || 4;
    const denominator = timeSignature.denominator || 4;
    const thirtySeconds = timeSignature.thirtyseconds || 8;

    const beatsToSkip = numerator * (4 / denominator);
    // const beatsPerMeasure = numerator / (denominator * (thirtySeconds / 32))

    let skippedBeats = beatsToSkip - 1;
    this.measureLines = {};
    let lastBeatTime = 0;
    Object.keys(this.temporalData.beatsBySecond).forEach((second) => {
      this.temporalData.beatsBySecond[second].forEach((beat) => {
        let beatDuration = beat[0] - lastBeatTime;
        lastBeatTime = beat[0];
        if (skippedBeats < beatsToSkip - 1) {
          skippedBeats++;
          return;
        }
        skippedBeats -= beatsToSkip - 1;

        let adjust = skippedBeats != 0 ? skippedBeats * beatDuration : 0;
        let beatSecond = Math.floor((beat[0] - adjust) / 1000);

        //dont count beats that come after the last note.
        if (beat[0] < this.getEnd()) {
          if (!this.measureLines.hasOwnProperty(beatSecond)) {
            this.measureLines[beatSecond] = [];
          }
          this.measureLines[beatSecond].push([beat[0] - adjust, Math.floor(beat[1] / beatsToSkip) + 1]);
        }
      });
    });
  }
  setSustainPeriods() {
    this.sustainPeriods = [];

    for (let channel in this.sustainsByChannelAndSecond) {
      let isOn = false;
      for (let second in this.sustainsByChannelAndSecond[channel]) {
        this.sustainsByChannelAndSecond[channel][second].forEach((sustain) => {
          if (isOn) {
            if (!sustain.isOn) {
              isOn = false;
              this.sustainPeriods[this.sustainPeriods.length - 1].end = sustain.timestamp;
            }
          } else {
            if (sustain.isOn) {
              isOn = true;
              this.sustainPeriods.push({
                start: sustain.timestamp,
                value: sustain.value,
                channel: channel,
              });
            }
          }
        });
      }
    }
  }
  getMicrosecondsPerBeat() {
    return this.microSecondsPerBeat;
  }
  getBPM(time) {
    for (let i = this.temporalData.bpms.length - 1; i >= 0; i--) {
      if (this.temporalData.bpms[i].timestamp < time) {
        return this.temporalData.bpms[i].bpm;
      }
    }
  }

  /* from 초부터 to초까지의 노트들을 반환함. ms가 아닌 s단위 */
  getNotes(from: number, to: number) {
    let secondStart = Math.floor(from);
    let secondEnd = Math.floor(to);
    let notes = [];
    for (let i = secondStart; i < secondEnd; i++) {
      for (let track in this.activeTracks) {
        if (this.activeTracks[track].notesBySeconds.hasOwnProperty(i)) {
          for (let n in this.activeTracks[track].notesBySeconds[i]) {
            let note = this.activeTracks[track].notesBySeconds[i][n];
            if (note.timestamp > from) {
              notes.push(note);
            }
          }
        }
      }
    }
    return notes;
  }

  parseAllControlEvents() {
    this.tracks.forEach((track) => {
      track.forEach((event) => {
        if (event.type == 'controller' && event.controllerType == 7) {
          if (!this.controlEvents.hasOwnProperty(Math.floor(event.timestamp / 1000))) {
            this.controlEvents[Math.floor(event.timestamp / 1000)] = [];
          }
          this.controlEvents[Math.floor(event.timestamp / 1000)].push(event);
        }
      });
    });
  }
  getAllInstruments() {
    const instruments: Instruments = {};
    this.controlEvents = {};

    this.tracks.forEach((track) => {
      this.getAllInstrumentsOfTrack(track).forEach((instrumentId) => (instruments[instrumentId] = true));
    });
    return Object.keys(instruments);
  }
  getAllInstrumentsOfTrack(track) {
    let instruments: Instruments = {};
    let programs = {};
    track.forEach((event) => {
      let channel = event.channel;

      if (event.type == 'programChange') {
        programs[channel] = event.programNumber;
      }

      if (event.type == 'noteOn' || event.type == 'noteOff') {
        if (channel != 9) {
          let program = programs[channel];
          let instrument = CONST.INSTRUMENTS.BY_ID[isFinite(program) ? program : channel];
          instruments[instrument.id] = true;
          event.instrument = instrument.id;
        } else {
          instruments['percussion'] = true;
          event.instrument = 'percussion';
        }
      }
    });
    return Object.keys(instruments);
  }
  processEvents(midiData) {
    midiData.trackInstruments = {};
    midiData.tracks.forEach((track, trackIndex) => {
      midiData.trackInstruments[trackIndex] = this.getAllInstrumentsOfTrack(track);
    });
    let songWorker = new Worker('./js/SongWorker.js');
    songWorker.onmessage = (ev) => {
      let dat = JSON.parse(ev.data);
      this.sustainPeriods = dat.sustainPeriods;
      this.activeTracks = dat.activeTracks;
      this.otherTracks = dat.otherTracks;
      this.longNotes = dat.longNotes;
      this.controlEvents = dat.controlEvents;
      this.text = dat.otherParams.text;
      this.markers = dat.otherParams.markers;
      this.timeSignatures = dat.otherParams.timeSignatures;
      this.keySignatures = dat.otherParams.keySignatures;
      this.smpteOffset = dat.otherParams.smpteOffset;

      this.ready = true;
      this.getMeasureLines();
      this.onready(this);
      if (getSetting('enableSheet')) this.generateSheet();
      //TODO wait for/modify Vexflow to be able to run in worker
      // let sheetGenWorker = new Worker("./js/SheetGenWorker.js")
      // sheetGenWorker.onmessage = ev => {
      // 	console.log(ev)
      // }
      // sheetGenWorker.postMessage(
      // 	JSON.stringify({
      // 		tracks: this.activeTracks,
      // 		measuresBySecond: this.getMeasureLines(),
      // 		numerator: this.getTimeSignature().numerator,
      // 		denominator: this.getTimeSignature().denominator,
      // 		keySignatureName:
      // 			CONST.MIDI_TO_VEXFLOW_KEYS[
      // 				this.getKeySignature().scale == 0 ? "MAJOR" : "MINOR"
      // 			][this.getKeySignature().key],
      // 		end: this.getEnd(),
      // 		isScroll: getSetting("sheetMeasureScroll"),
      // 		windowWidth: window.innerWidth,
      // 		midiNoteToKey: CONST.MIDI_NOTE_TO_KEY
      // 	})
      // )
    };
    songWorker.onerror = (e) => {
      console.error(e);
    };
    songWorker.postMessage(JSON.stringify(midiData));
  }

  async generateSheet() {
    // TODO: loader 생기면 주석 해제
    // getLoader().startLoad();
    // getLoader().setLoadMessage('Generating Sheet from MIDI');

    await this.getSheet();
  }
  async getSheet() {
    if (this.sheetGen) {
      this.sheetGen.clear();
      this.sheetGen = null;
      console.log('cleared sheet');
    }
    if (!this.sheetGen) {
      console.log('creating sheet');
      this.sheetGen = new SheetGenerator(
        this.getMeasureLines(),
        this.getTimeSignature().numerator,
        this.getTimeSignature().denominator,
        this.getKeySignature(),
        this.getEnd(),
      );
      console.log(this.sheetGen);
    }
    await this.sheetGen.generate(this.activeTracks).then(() => getLoader().stopLoad());
  }

  /* 이벤트들을 타입에 맞게 분배한다. */
  distributeEvents(track, newTrack) {
    track.forEach((event) => {
      event.id = this.idCounter++;
      if (event.type == 'noteOn' || event.type == 'noteOff') {
        newTrack.notes.push(event);
      } else if (event.type == 'setTempo') {
        newTrack.tempoChanges.push(event);
      } else if (event.type == 'trackName') {
        newTrack.name = event.text;
      } else if (event.type == 'text') {
        this.text.push(event.text);
      } else if (event.type == 'timeSignature') {
        this.timeSignatures.push(event);
      } else if (event.type == 'keySignature') {
        newTrack.keySignature = event;
        this.keySignatures.push(event);
      } else if (event.type == 'smpteOffset') {
        this.smpteOffset = event;
      } else if (event.type == 'marker') {
        this.markers.push(event);
      } else {
        newTrack.meta.push(event);
      }
    });
  }

  setNotesBySecond(track) {
    track.notes.forEach((note) => {
      let second = Math.floor(note.timestamp / 1000);
      if (track.notesBySeconds.hasOwnProperty(second)) {
        track.notesBySeconds[second].push(note);
      } else {
        track.notesBySeconds[second] = [note];
      }
    });
  }

  getNoteSequence() {
    if (!this.notesSequence) {
      let tracks = [];
      for (let t in this.activeTracks) [tracks.push(this.activeTracks[t].notes)];

      this.noteSequence = [].concat.apply([], tracks).sort((a, b) => a.timestamp - b.timestamp);
    }
    return this.noteSequence.slice(0);
  }

  getNoteRange() {
    let seq = this.getNoteSequence();
    let min = 87;
    let max = 0;
    seq.forEach((note) => {
      if (note.noteNumber > max) {
        max = note.noteNumber;
      }
      if (note.noteNumber < min) {
        min = note.noteNumber;
      }
    });
    return { min, max };
  }

  setNoteSustainTimestamps(notes: MidiNote[]) {
    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];
      let currentSustains = this.sustainPeriods
        .filter((period) => period.channel == note.channel)
        .filter(
          (period) =>
            (period.start < note.timestamp && period.end > note.timestamp) ||
            (period.start < note.offTime && period.end > note.offTime),
        );
      if (currentSustains.length) {
        note.sustainOnTime = currentSustains[0].start;
        let end = Math.max.apply(
          null,
          currentSustains.map((sustain) => sustain.end),
        );
        note.sustainOffTime = end;
        note.sustainDuration = note.sustainOffTime - note.timestamp;
      }
    }
  }

  setNoteOffTimestamps(notes: MidiNote[]) {
    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];
      if (note.type == 'noteOn') {
        Song.findOffNote(i, notes.slice(0));
      }
    }
  }

  static findOffNote(index: number, notes: MidiNote[]) {
    let onNote = notes[index];
    for (let i = index + 1; i < notes.length; i++) {
      if (notes[i].type == 'noteOff' && onNote.noteNumber == notes[i].noteNumber) {
        onNote.offTime = notes[i].timestamp;
        onNote.offVelocity = notes[i].velocity;
        onNote.duration = onNote.offTime - onNote.timestamp;

        break;
      }
    }
  }
}

export function getDefaultChannels() {
  const channels: MidiChannels = {};
  for (let i = 0; i <= 15; i++) {
    channels[i] = {
      instrument: i,
      pitchBend: 0,
      volume: 127,
      volumeControl: 50,
      mute: false,
      mono: false,
      omni: false,
      solo: false,
    };
  }
  channels[9].instrument = -1;
  return channels;
}
