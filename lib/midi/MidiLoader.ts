import { MidiEvent } from '@typings/MidiEvent';
import axios from 'axios';
import Parser from './Parser';
import { MidiData, MidiHeader } from './Song';

export default class MidiLoader {
  static async loadFile(url: string) {
    // const response = await fetch(url);
    // if (response.ok) {
    //   const arrayBuffer = await response.arrayBuffer();
    //   if (arrayBuffer) {
    //     return parseMidi(new Uint8Array(arrayBuffer));
    //   }
    // } else {
    //   throw new Error(`could not load ${url}`);
    // }
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return parseMidi(new Uint8Array(response.data));
    } catch (err) {
      console.error(err);
    }
  }
}

function parseMidi(data: Uint8Array): MidiData {
  const p = new Parser(data);

  const headerChunk = p.readChunk();
  if (headerChunk.id != 'MThd') throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "'";
  const header = parseHeader(headerChunk.data);

  const tracks: MidiEvent[][] = [];
  for (var i = 0; !p.eof() && i < header.numTracks; i++) {
    const trackChunk = p.readChunk();
    if (trackChunk.id != 'MTrk') throw new Error(`Bad MIDI file.  Expected 'MTrk', got: '${trackChunk.id}'`);
    const track = parseTrack(trackChunk.data);
    tracks.push(track);
  }

  const midiData = { header, tracks };

  const temporalData = Parser.setTemporal(midiData);
  return {
    header,
    tracks,
    temporalData,
    trackInstruments: {},
  };
}

function parseHeader(data: Uint8Array): MidiHeader {
  const p = new Parser(data);

  const format = p.readUInt16();
  const numTracks = p.readUInt16();

  // 세팅되지 않은 값은 -1로 설정
  let framesPerSecond = -1;
  let ticksPerFrame = -1;
  let ticksPerBeat = -1;

  const timeDivision = p.readUInt16();
  if (timeDivision & 0x8000) {
    framesPerSecond = 0x100 - (timeDivision >> 8);
    ticksPerFrame = timeDivision & 0xff;
  } else {
    ticksPerBeat = timeDivision;
  }

  return {
    format,
    numTracks,
    ticksPerBeat,
    ticksPerFrame,
    framesPerSecond,
  };
}

function parseTrack(data: Uint8Array): MidiEvent[] {
  const parser = new Parser(data);

  let events = [];
  while (!parser.eof()) {
    let event = readEvent();
    events.push(event);
  }

  return events;

  let lastEventTypeByte: number | null = null;

  function readEvent(): MidiEvent {
    const event: any = {};
    event.deltaTime = parser.readVarInt();

    let eventTypeByte = parser.readUInt8();

    if ((eventTypeByte & 0xf0) === 0xf0) {
      // system / meta event
      if (eventTypeByte === 0xff) {
        // meta event
        event.meta = true;
        var metatypeByte = parser.readUInt8();
        var length = parser.readVarInt();
        switch (metatypeByte) {
          case 0x00:
            event.type = 'sequenceNumber';
            if (length !== 2) throw 'Expected length for sequenceNumber event is 2, got ' + length;
            event.number = parser.readUInt16();
            return event;
          case 0x01:
            event.type = 'text';
            event.text = parser.readString(length);
            return event;
          case 0x02:
            event.type = 'copyrightNotice';
            event.text = parser.readString(length);
            return event;
          case 0x03:
            event.type = 'trackName';
            event.text = parser.readString(length);
            return event;
          case 0x04:
            event.type = 'instrumentName';
            event.text = parser.readString(length);
            return event;
          case 0x05:
            event.type = 'lyrics';
            event.text = parser.readString(length);
            return event;
          case 0x06:
            event.type = 'marker';
            event.text = parser.readString(length);
            return event;
          case 0x07:
            event.type = 'cuePoint';
            event.text = parser.readString(length);
            return event;
          case 0x20:
            event.type = 'channelPrefix';
            if (length != 1) throw 'Expected length for channelPrefix event is 1, got ' + length;
            event.channel = parser.readUInt8();
            return event;
          case 0x21:
            event.type = 'portPrefix';
            if (length != 1) throw 'Expected length for portPrefix event is 1, got ' + length;
            event.port = parser.readUInt8();
            return event;
          case 0x2f:
            event.type = 'endOfTrack';
            if (length != 0) throw 'Expected length for endOfTrack event is 0, got ' + length;
            return event;
          case 0x51:
            event.type = 'setTempo';
            if (length != 3) throw 'Expected length for setTempo event is 3, got ' + length;
            event.microsecondsPerBeat = parser.readUInt24();
            return event;
          case 0x54:
            event.type = 'smpteOffset';
            if (length != 5) throw 'Expected length for smpteOffset event is 5, got ' + length;
            const hourByte = parser.readUInt8();
            // const FRAME_RATES = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 };
            const FRAME_RATES = new Map();
            FRAME_RATES.set(0x00, 24);
            FRAME_RATES.set(0x20, 25);
            FRAME_RATES.set(0x40, 29);
            FRAME_RATES.set(0x60, 30);

            event.frameRate = FRAME_RATES.get(hourByte & 0x60);
            event.hour = hourByte & 0x1f;
            event.min = parser.readUInt8();
            event.sec = parser.readUInt8();
            event.frame = parser.readUInt8();
            event.subFrame = parser.readUInt8();
            return event;
          case 0x58:
            event.type = 'timeSignature';
            if (length != 4) throw 'Expected length for timeSignature event is 4, got ' + length;

            event.numerator = parser.readUInt8();
            event.denominator = 1 << parser.readUInt8();
            event.metronome = parser.readUInt8();
            event.thirtyseconds = parser.readUInt8();
            return event;
          case 0x59:
            event.type = 'keySignature';
            if (length != 2) throw 'Expected length for keySignature event is 2, got ' + length;
            event.key = parser.readInt8();
            event.scale = parser.readUInt8();
            return event;
          case 0x7f:
            event.type = 'sequencerSpecific';
            event.data = parser.readBytes(length);
            return event;
          default:
            event.type = 'unknownMeta';
            event.data = parser.readBytes(length);
            event.metatypeByte = metatypeByte;
            return event;
        }
      } else if (eventTypeByte == 0xf0) {
        event.type = 'sysEx';
        var length = parser.readVarInt();
        event.data = parser.readBytes(length);
        return event;
      } else if (eventTypeByte == 0xf7) {
        event.type = 'endSysEx';
        var length = parser.readVarInt();
        event.data = parser.readBytes(length);
        return event;
      } else {
        throw 'Unrecognised MIDI event type byte: ' + eventTypeByte;
      }
    } else {
      // channel event
      var param1;
      if ((eventTypeByte & 0x80) === 0) {
        // running status - reuse lastEventTypeByte as the event type.
        // eventTypeByte is actually the first parameter
        if (lastEventTypeByte === null) throw 'Running status byte encountered before status byte';
        param1 = eventTypeByte;
        eventTypeByte = lastEventTypeByte;
        event.running = true;
      } else {
        param1 = parser.readUInt8();
        lastEventTypeByte = eventTypeByte;
      }
      var eventType = eventTypeByte >> 4;
      event.channel = eventTypeByte & 0x0f;
      switch (eventType) {
        case 0x08:
          event.type = 'noteOff';
          event.midiNoteNumber = param1;
          event.noteNumber = param1 - 21;
          event.velocity = parser.readUInt8();
          return event;
        case 0x09:
          var velocity = parser.readUInt8();
          event.type = velocity === 0 ? 'noteOff' : 'noteOn';
          event.midiNoteNumber = param1;
          event.noteNumber = param1 - 21;
          event.velocity = velocity;
          if (velocity === 0) event.byte9 = true;
          return event;
        case 0x0a:
          event.type = 'noteAftertouch';
          event.midiNoteNumber = param1;
          event.noteNumber = param1 - 21;
          event.amount = parser.readUInt8();
          return event;
        case 0x0b:
          event.type = 'controller';
          event.controllerType = param1;
          event.value = parser.readUInt8();
          return event;
        case 0x0c:
          event.type = 'programChange';
          event.programNumber = param1;
          return event;
        case 0x0d:
          event.type = 'channelAftertouch';
          event.amount = param1;
          return event;
        case 0x0e:
          event.type = 'pitchBend';
          event.value = param1 + (parser.readUInt8() << 7) - 0x2000;
          return event;
        default:
          throw 'Unrecognised MIDI event type: ' + eventType;
      }
    }
  }
}
