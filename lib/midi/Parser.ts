import { MidiEvent, MidiMetaKeySignatureEvent, MidiMetaTimeSignatureEvent } from '@typings/MidiEvent';
import { BeatsBySecond, BPM, getDefaultChannels, MidiData, SustainsByChannelAndSecond } from './Song';

export interface TrackState {
  nextEventIndex: number;
  ticksToNextEvent: number;
}

export interface NextEvent<T extends MidiEvent = MidiEvent> {
  ticksToEvent: number;
  event: T;
  track: number;
}

export default class Parser {
  private buffer: Uint8Array;
  private bufferLen: number;
  private pos: number;

  constructor(data: Uint8Array) {
    this.buffer = data;
    this.bufferLen = this.buffer.length;
    this.pos = 0;
  }

  eof() {
    return this.pos >= this.bufferLen;
  }

  readUInt8() {
    const result = this.buffer[this.pos];
    this.pos += 1;
    return result;
  }

  readInt8() {
    const u = this.readUInt8();
    return u & 0x80 ? u - 0x100 : u;
  }

  readUInt16() {
    const b0 = this.readUInt8();
    const b1 = this.readUInt8();
    return (b0 << 8) + b1;
  }

  readInt16() {
    const u = this.readUInt16();
    return u & 0x8000 ? u - 0x10000 : u;
  }

  readUInt24() {
    const b0 = this.readUInt8();
    const b1 = this.readUInt8();
    const b2 = this.readUInt8();
    return (b0 << 16) + (b1 << 8) + b2;
  }

  readInt24() {
    const u = this.readUInt24();
    return u & 0x800000 ? u - 0x1000000 : u;
  }

  readUInt32() {
    const b0 = this.readUInt8();
    const b1 = this.readUInt8();
    const b2 = this.readUInt8();
    const b3 = this.readUInt8();
    return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
  }

  readBytes(length: number) {
    const bytes = this.buffer.slice(this.pos, this.pos + length);
    this.pos += length;
    return bytes;
  }

  readString(length: number) {
    const bytes = this.readBytes(length);
    // return String.fromCharCode.apply(null, bytes);
    return String.fromCharCode(...Array.from(bytes));
  }

  readVarInt() {
    let result = 0;
    while (!this.eof()) {
      let b = this.readUInt8();
      if (b & 0x80) {
        result += b & 0x7f;
        result <<= 7;
      } else {
        return result + b;
      }
    }
    return result;
  }

  readChunk(): { id: string; length: number; data: Uint8Array } {
    const id = this.readString(4);
    const length = this.readUInt32();
    const data = this.readBytes(length);

    return {
      id,
      data,
      length,
    };
  }

  /*********
   * <ADAPTED FROM JASMID>
   * Replayer.js
   *********/
  static setTemporal(midiData: Pick<MidiData, 'header' | 'tracks'>) {
    const trackStates: TrackState[] = [];
    let beatsPerMinute = 120;
    const ticksPerBeat = midiData.header.ticksPerBeat;
    let totTime = 0;
    const bpms: BPM[] = [];
    let beatNumber = 1;
    let generatedBeats = 0;
    const beatsBySecond: BeatsBySecond = { 0: [[0, 0]] };
    const sustainsByChannelAndSecond: SustainsByChannelAndSecond = {};
    const timeSignatures: NextEvent<MidiMetaTimeSignatureEvent>[] = [];
    const keySignatures: NextEvent<MidiMetaKeySignatureEvent>[] = [];
    let channels = getDefaultChannels();
    for (let t in midiData.tracks) {
      let track = midiData.tracks[t];
      trackStates.push({
        nextEventIndex: 0,
        ticksToNextEvent: track.length ? track[0].deltaTime : -1,
      });
    }
    let midiEvent: NextEvent | null = null;

    function getNextEvent(): NextEvent | null {
      let ticksToNextEvent = -1;
      let nextEventTrack = -1;
      let nextEventIndex = -1;

      //search all tracks for next event.
      for (let i = 0; i < trackStates.length; i++) {
        if (
          trackStates[i].ticksToNextEvent !== -1 &&
          (ticksToNextEvent === -1 || (trackStates[i].ticksToNextEvent as number) < ticksToNextEvent)
        ) {
          ticksToNextEvent = trackStates[i].ticksToNextEvent;
          nextEventTrack = i;
          nextEventIndex = trackStates[i].nextEventIndex;
        }
      }
      if (nextEventTrack !== -1 && nextEventIndex !== -1) {
        // get next event from that track and
        var nextEvent: MidiEvent = midiData.tracks[nextEventTrack][nextEventIndex];
        if (midiData.tracks[nextEventTrack][nextEventIndex + 1]) {
          trackStates[nextEventTrack].ticksToNextEvent += midiData.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
        } else {
          trackStates[nextEventTrack].ticksToNextEvent = -1;
        }
        trackStates[nextEventTrack].nextEventIndex += 1;
        // advance timings on all tracks
        for (var i = 0; i < trackStates.length; i++) {
          if (trackStates[i].ticksToNextEvent != -1) {
            trackStates[i].ticksToNextEvent -= ticksToNextEvent;
          }
        }
        return {
          ticksToEvent: ticksToNextEvent,
          event: nextEvent,
          track: nextEventTrack,
        };
      } else {
        return null;
      }
    } //end getNextEvent

    function processNext() {
      if (!midiEvent) {
        throw new Error('No midi event to process');
      }

      let oldBPM = 0;

      if (midiEvent.event.type === 'setTempo') {
        // tempo change events can occur anywhere in the middle and affect events that follow

        oldBPM = beatsPerMinute;

        beatsPerMinute = 60000000 / midiEvent.event.microsecondsPerBeat;
      }
      if (midiEvent.event.type === 'controller' && midiEvent.event.controllerType === 7) {
        channels[midiEvent.event.channel].volume = midiEvent.event.value;
      }

      if (midiEvent.event.type === 'timeSignature') {
        // @ts-ignore
        timeSignatures.push(midiEvent);
      }
      if (midiEvent.event.type === 'keySignature') {
        // @ts-ignore
        keySignatures.push(midiEvent);
      }

      var beatsToGenerate = 0;
      var secondsToGenerate = 0;
      if (midiEvent.ticksToEvent > 0) {
        beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
        secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
      }
      var time = secondsToGenerate * 1000 || 0;
      midiEvent.event.temporalDelta = time;
      totTime += time;
      midiEvent.event.timestamp = totTime;

      //Keep track of sustain on/offs
      if (midiEvent.event.type == 'controller' && midiEvent.event.controllerType == 64) {
        let currentSecond = Math.floor(totTime / 1000);
        if (!sustainsByChannelAndSecond.hasOwnProperty(midiEvent.event.channel)) {
          sustainsByChannelAndSecond[midiEvent.event.channel] = {};
        }
        if (!sustainsByChannelAndSecond[midiEvent.event.channel].hasOwnProperty(currentSecond)) {
          sustainsByChannelAndSecond[midiEvent.event.channel][currentSecond] = [];
        }
        sustainsByChannelAndSecond[midiEvent.event.channel][currentSecond].push({
          timestamp: totTime,
          isOn: midiEvent.event.value > 64,
          value: midiEvent.event.value,
        });
      }

      //keep track of completed beats to show beatLines
      generatedBeats += beatsToGenerate;

      while (generatedBeats >= 1) {
        generatedBeats -= 1;
        //TODO fixes 311-1st, but correct?
        // let bpm = oldBPM > 0 ? oldBPM : beatsPerMinute
        let bpm = beatsPerMinute;
        secondsToGenerate = generatedBeats / (bpm / 60);
        let beatTime = totTime - secondsToGenerate * 1000;
        let beatSecond = Math.floor(beatTime / 1000);
        //TODO Mz-311 1st parses incorrectly - last setTempo has deltaTime of 50000+
        if (beatSecond >= 0) {
          if (!beatsBySecond.hasOwnProperty(beatSecond)) {
            beatsBySecond[beatSecond] = [];
          }
          beatsBySecond[beatSecond].push([beatTime, beatNumber]);
        }
        beatNumber++;
      }

      if (midiEvent.event.hasOwnProperty('channel')) {
        // channel 이벤트일 경우 channelVolume 도 저장
        // @ts-ignore
        midiEvent.event.channelVolume = channels[midiEvent.event.channel].volume;
      }
      midiEvent = getNextEvent();
      if (oldBPM) {
        bpms.push({
          bpm: beatsPerMinute,
          timestamp: totTime,
        });
      }
    } //end processNext

    if ((midiEvent = getNextEvent())) {
      while (midiEvent) processNext();
    }
    /*********
     * </ADAPTED FROM JASMID>
     *********/

    return {
      bpms,
      beatsBySecond,
      sustainsByChannelAndSecond,
      timeSignatures,
      keySignatures,
    };
  }
}
