let idCounter = 0;

self.onmessage = (ev) => {
  self.postMessage(JSON.stringify(processEvents(JSON.parse(ev.data))));
  self.close();
};

self.onerror = (ev) => {
  console.error(ev);
};

const processEvents = (midiData) => {
  const sustainsByChannelAndSecond = midiData.temporalData.sustainsByChannelAndSecond;
  const sustainPeriods = getSustainPeriods(sustainsByChannelAndSecond);

  const otherParams = {
    text: [],
    markers: [],
    timeSignatures: [],
    keySignatures: [],
  };
  const activeTracks = [];
  const otherTracks = [];
  const longNotes = {};

  midiData.tracks.forEach((midiTrack, trackIndex) => {
    const newTrack = {
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
        const newTrackWithDifferentInstrument = {
          notes: [],
          meta: [],
          tempoChanges: [],
          instrument: instrument,
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
const distributeEvents = (track, newTrack, otherParams) => {
  track.forEach((event) => {
    event.id = idCounter++;
    if (event.type == 'noteOn' || event.type == 'noteOff') {
      // TODO: ???????????? ???????????? ???????????? ????????? ?????? ignore ??????
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
      // TODO: ????????? ???????????? ????????? ????????? ????????? ??????????????? meta??? ?????????. ?????? ?????? ??? ?????? ??????. ????????? ???????????? ???
      // @ts-ignore
      newTrack.meta.push(event);
    }
  });
};

const setNoteSustainTimestamps = (notes, sustainPeriods) => {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const currentSustains = sustainPeriods
      .filter((period) => parseInt(period.channel) === note.channel)
      .filter(
        (period) =>
          (period.start < note.timestamp && period.end > note.timestamp) ||
          (period.start < note.offTime && period.end > note.offTime),
      );
    if (currentSustains.length) {
      note.sustainOnTime = currentSustains[0].start;
      const end = Math.max.apply(
        null,
        currentSustains.map((sustain) => sustain.end),
      );
      note.sustainOffTime = end;
      note.sustainDuration = note.sustainOffTime - note.timestamp;
    }
  }
};

const setNotesBySecond = (track) => {
  track.notes.forEach((note) => {
    const second = Math.floor(note.timestamp / 1000);
    if (track.notesBySeconds.hasOwnProperty(second)) {
      track.notesBySeconds[second].push(note);
    } else {
      track.notesBySeconds[second] = [note];
    }
  });
};

const setNoteOffTimestamps = (notes) => {
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    if (note.type == 'noteOn') {
      findOffNote(i, notes.slice(0));
    }
  }
};

const findOffNote = (index, notes) => {
  const onNote = notes[index];
  for (let i = index + 1; i < notes.length; i++) {
    /* TODO: ?????? ???????????? noteOff ????????? ????????? ????????????, ??? ????????? ?????? ???????????? ????????????. ???????????? ????????? noteOn?????? ????????? ?????? false???. */
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

const getSustainPeriods = (sustainsByChannelAndSecond) => {
  const sustainPeriods = [];

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

const parseAllControlEvents = (tracks) => {
  const controlEvents = {};
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
