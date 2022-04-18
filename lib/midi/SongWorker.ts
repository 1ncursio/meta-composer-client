import {
  MidiEvent,
  MidiMetaKeySignatureEvent,
  MidiMetaMarkerEvent,
  MidiMetaSMPTEOffsetEvent,
  MidiMetaTimeSignatureEvent,
} from '@typings/MidiEvent';
import { LongNotes } from './Player';
import {
  ActiveTrack,
  ControllEvents,
  MidiChannelSongNoteEvent,
  MidiData,
  SustainPeriod,
  SustainsByChannelAndSecond,
} from './Song';

export interface OtherParams {
  text: string[];
  markers: MidiMetaMarkerEvent[];
  timeSignatures: MidiMetaTimeSignatureEvent[];
  keySignatures: MidiMetaKeySignatureEvent[];
  smpteOffset?: MidiMetaSMPTEOffsetEvent;
}

let idCounter = 0;

self.onmessage = (ev) => {
  self.postMessage(JSON.stringify(processEvents(JSON.parse(ev.data))));
  self.close();
};

self.onerror = (ev) => {
  console.error(ev);
};

const processEvents = (midiData: MidiData) => {
  const sustainsByChannelAndSecond = midiData.temporalData.sustainsByChannelAndSecond;
  const sustainPeriods = getSustainPeriods(sustainsByChannelAndSecond);

  const otherParams = {
    text: [],
    markers: [],
    timeSignatures: [],
    keySignatures: [],
  };
  const activeTracks: ActiveTrack[] = [];
  const otherTracks: ActiveTrack[] = [];
  const longNotes: LongNotes = {};

  midiData.tracks.forEach((midiTrack, trackIndex) => {
    const newTrack: ActiveTrack = {
      notes: [],
      meta: [],
      tempoChanges: [],
      name: '',
      instrument: '',
      notesBySeconds: {},
    };

    distributeEvents(midiTrack, newTrack, otherParams);

    if (newTrack.notes.length) {
      const allInstrumentsInTrack = midiData.trackInstruments[trackIndex];
      const newTracks = [];
      while (allInstrumentsInTrack.length >= 1) {
        const instrument = allInstrumentsInTrack.shift();
        const newTrackWithDifferentInstrument: ActiveTrack = {
          notes: [],
          meta: [],
          tempoChanges: [],
          instrument: instrument as string,
          notesBySeconds: {},
          name: '',
        };
        distributeEvents(midiTrack, newTrackWithDifferentInstrument, otherParams);
        newTrackWithDifferentInstrument.notes = newTrack.notes.filter((note) => note.instrument == instrument);

        newTracks.push(newTrackWithDifferentInstrument);
      }
      newTracks.forEach((theNewTrack) => activeTracks.push(theNewTrack));
    } else {
      otherTracks.push(newTrack);
    }
  });

  activeTracks.forEach((track, trackIndex) => {
    track.notesBySeconds = {};
    setNoteOffTimestamps(track.notes);
    setNoteSustainTimestamps(track.notes, sustainPeriods);
    track.notes = track.notes.slice(0).filter((note) => note.type === 'noteOn');
    track.notes.forEach((note) => (note.track = trackIndex));
    setNotesBySecond(track);
    longNotes[trackIndex] = track.notes.filter((note) => note.duration > 4 * 1000);
  });

  const controlEvents = parseAllControlEvents(midiData.tracks);

  return {
    sustainPeriods,
    otherParams,
    activeTracks,
    otherTracks,
    longNotes,
    controlEvents,
  };
};
const distributeEvents = (track: MidiEvent[], newTrack: ActiveTrack, otherParams: OtherParams) => {
  track.forEach((event) => {
    event.id = idCounter++;
    if (event.type == 'noteOn' || event.type == 'noteOff') {
      // TODO: 후처리된 이벤트가 저장되긴 할텐데 일단 ignore 처리
      // @ts-ignore
      newTrack.notes.push(event);
    } else if (event.type == 'setTempo') {
      newTrack.tempoChanges.push(event);
    } else if (event.type == 'trackName') {
      newTrack.name = event.text;
    } else if (event.type == 'text') {
      otherParams.text.push(event.text);
    } else if (event.type == 'timeSignature') {
      otherParams.timeSignatures.push(event);
    } else if (event.type == 'keySignature') {
      newTrack.keySignature = event;
      otherParams.keySignatures.push(event);
    } else if (event.type == 'smpteOffset') {
      otherParams.smpteOffset = event;
    } else if (event.type == 'marker') {
      otherParams.markers.push(event);
    } else {
      // TODO: 위에서 처리하는 것들을 제외한 나머지 이벤트들은 meta에 넣는다. 이게 좋을 것 같진 않음. 나중에 수정해야 함
      // @ts-ignore
      newTrack.meta.push(event);
    }
  });
};

const setNoteSustainTimestamps = (notes: MidiChannelSongNoteEvent[], sustainPeriods: SustainPeriod[]) => {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const currentSustains = sustainPeriods
      .filter((period) => parseInt(period.channel) === note.channel)
      .filter(
        (period) =>
          (period.start < note.timestamp && (period.end as number) > note.timestamp) ||
          (period.start < note.offTime && (period.end as number) > note.offTime),
      );
    if (currentSustains.length) {
      note.sustainOnTime = currentSustains[0].start;
      const end = Math.max.apply(
        null,
        currentSustains.map((sustain) => sustain.end as number),
      );
      note.sustainOffTime = end;
      note.sustainDuration = note.sustainOffTime - note.timestamp;
    }
  }
};

const setNotesBySecond = (track: ActiveTrack) => {
  track.notes.forEach((note) => {
    const second = Math.floor(note.timestamp / 1000);
    if (track.notesBySeconds.hasOwnProperty(second)) {
      // @ts-ignore
      track.notesBySeconds[second].push(note);
    } else {
      // @ts-ignore
      track.notesBySeconds[second] = [note];
    }
  });
};

const setNoteOffTimestamps = (notes: MidiChannelSongNoteEvent[]) => {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.type == 'noteOn') {
      findOffNote(i, notes.slice(0));
    }
  }
};

const findOffNote = (index: number, notes: MidiChannelSongNoteEvent[]) => {
  const onNote = notes[index];
  for (let i = index + 1; i < notes.length; i++) {
    /* TODO: 원래 아래처럼 noteOff 조건이 들어가 있었는데, 왜 이렇게 되어 있었는지 모르겠음. 호출하는 조건은 noteOn이라 사실상 항상 false임. */
    // if (notes[i].type === 'noteOff' && onNote.noteNumber === notes[i].noteNumber) {
    if (onNote.noteNumber === notes[i].noteNumber) {
      onNote.offTime = notes[i].timestamp;
      onNote.offVelocity = notes[i].velocity;
      onNote.duration = onNote.offTime - onNote.timestamp;

      return;
    }
  }

  //TODO How to determine end if last note has no offEvent?
  onNote.offTime = notes[Math.min(index + 1, notes.length - 1)].timestamp;
  onNote.offVelocity = 0;
  onNote.duration = onNote.offTime - onNote.timestamp;
};

const getSustainPeriods = (sustainsByChannelAndSecond: SustainsByChannelAndSecond) => {
  const sustainPeriods: SustainPeriod[] = [];

  for (let channel in sustainsByChannelAndSecond) {
    let isOn = false;
    for (let second in sustainsByChannelAndSecond[channel]) {
      sustainsByChannelAndSecond[channel][second].forEach((sustain) => {
        if (isOn) {
          if (!sustain.isOn) {
            isOn = false;
            sustainPeriods[sustainPeriods.length - 1].end = sustain.timestamp;
          }
        } else {
          if (sustain.isOn) {
            isOn = true;
            sustainPeriods.push({
              start: sustain.timestamp,
              value: sustain.value,
              channel: channel,
            });
          }
        }
      });
    }
  }
  return sustainPeriods;
};

const parseAllControlEvents = (tracks: MidiEvent[][]) => {
  const controlEvents: ControllEvents = {};
  tracks.forEach((track) => {
    track.forEach((event) => {
      if (event.type == 'controller' && event.controllerType == 7) {
        if (!controlEvents.hasOwnProperty(Math.floor(event.timestamp / 1000))) {
          controlEvents[Math.floor(event.timestamp / 1000)] = [];
        }
        controlEvents[Math.floor(event.timestamp / 1000)].push(event);
      }
    });
  });
  return controlEvents;
};
