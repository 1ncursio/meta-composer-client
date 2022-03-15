"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idCounter = 0;
self.onmessage = function (ev) {
    postMessage(JSON.stringify(processEvents(JSON.parse(ev.data))));
    self.close();
};
self.onerror = function (ev) {
    console.error(ev);
};
var processEvents = function (midiData) {
    var sustainsByChannelAndSecond = midiData.temporalData.sustainsByChannelAndSecond;
    var sustainPeriods = getSustainPeriods(sustainsByChannelAndSecond);
    var otherParams = {
        text: [],
        markers: [],
        timeSignatures: [],
        keySignatures: [],
    };
    var activeTracks = [];
    var otherTracks = [];
    var longNotes = {};
    midiData.tracks.forEach(function (midiTrack, trackIndex) {
        var newTrack = {
            notes: [],
            meta: [],
            tempoChanges: [],
            name: '',
            instrument: '',
            notesBySeconds: {},
        };
        distributeEvents(midiTrack, newTrack, otherParams);
        if (newTrack.notes.length) {
            var allInstrumentsInTrack = midiData.trackInstruments[trackIndex];
            var newTracks = [];
            var _loop_1 = function () {
                var instrument = allInstrumentsInTrack.shift();
                var newTrackWithDifferentInstrument = {
                    notes: [],
                    meta: [],
                    tempoChanges: [],
                    instrument: instrument,
                    notesBySeconds: {},
                    name: '',
                };
                distributeEvents(midiTrack, newTrackWithDifferentInstrument, otherParams);
                newTrackWithDifferentInstrument.notes = newTrack.notes.filter(function (note) { return note.instrument == instrument; });
                newTracks.push(newTrackWithDifferentInstrument);
            };
            while (allInstrumentsInTrack.length >= 1) {
                _loop_1();
            }
            newTracks.forEach(function (theNewTrack) { return activeTracks.push(theNewTrack); });
        }
        else {
            otherTracks.push(newTrack);
        }
    });
    activeTracks.forEach(function (track, trackIndex) {
        track.notesBySeconds = {};
        setNoteOffTimestamps(track.notes);
        setNoteSustainTimestamps(track.notes, sustainPeriods);
        track.notes = track.notes.slice(0).filter(function (note) { return note.type == 'noteOn'; });
        track.notes.forEach(function (note) { return (note.track = trackIndex); });
        setNotesBySecond(track);
        longNotes[trackIndex] = track.notes.filter(function (note) { return note.duration > 4 * 1000; });
    });
    var controlEvents = parseAllControlEvents(midiData.tracks);
    return {
        sustainPeriods: sustainPeriods,
        otherParams: otherParams,
        activeTracks: activeTracks,
        otherTracks: otherTracks,
        longNotes: longNotes,
        controlEvents: controlEvents,
    };
};
var distributeEvents = function (track, newTrack, otherParams) {
    track.forEach(function (event) {
        event.id = idCounter++;
        if (event.type == 'noteOn' || event.type == 'noteOff') {
            // TODO: 후처리된 이벤트가 저장되긴 할텐데 일단 ignore 처리
            // @ts-ignore
            newTrack.notes.push(event);
        }
        else if (event.type == 'setTempo') {
            newTrack.tempoChanges.push(event);
        }
        else if (event.type == 'trackName') {
            newTrack.name = event.text;
        }
        else if (event.type == 'text') {
            otherParams.text.push(event.text);
        }
        else if (event.type == 'timeSignature') {
            otherParams.timeSignatures.push(event);
        }
        else if (event.type == 'keySignature') {
            newTrack.keySignature = event;
            otherParams.keySignatures.push(event);
        }
        else if (event.type == 'smpteOffset') {
            otherParams.smpteOffset = event;
        }
        else if (event.type == 'marker') {
            otherParams.markers.push(event);
        }
        else {
            // TODO: 위에서 처리하는 것들을 제외한 나머지 이벤트들은 meta에 넣는다. 이게 좋을 것 같진 않음. 나중에 수정해야 함
            // @ts-ignore
            newTrack.meta.push(event);
        }
    });
};
var setNoteSustainTimestamps = function (notes, sustainPeriods) {
    var _loop_2 = function (i) {
        var note = notes[i];
        var currentSustains = sustainPeriods
            .filter(function (period) { return parseInt(period.channel) === note.channel; })
            .filter(function (period) {
            return (period.start < note.timestamp && period.end > note.timestamp) ||
                (period.start < note.offTime && period.end > note.offTime);
        });
        if (currentSustains.length) {
            note.sustainOnTime = currentSustains[0].start;
            var end = Math.max.apply(null, currentSustains.map(function (sustain) { return sustain.end; }));
            note.sustainOffTime = end;
            note.sustainDuration = note.sustainOffTime - note.timestamp;
        }
    };
    for (var i = 0; i < notes.length; i++) {
        _loop_2(i);
    }
};
var setNotesBySecond = function (track) {
    track.notes.forEach(function (note) {
        var second = Math.floor(note.timestamp / 1000);
        if (track.notesBySeconds.hasOwnProperty(second)) {
            track.notesBySeconds[second].push(note);
        }
        else {
            track.notesBySeconds[second] = [note];
        }
    });
};
var setNoteOffTimestamps = function (notes) {
    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        if (note.type == 'noteOn') {
            findOffNote(i, notes.slice(0));
        }
    }
};
var findOffNote = function (index, notes) {
    var onNote = notes[index];
    for (var i = index + 1; i < notes.length; i++) {
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
var getSustainPeriods = function (sustainsByChannelAndSecond) {
    var sustainPeriods = [];
    var _loop_3 = function (channel) {
        var isOn = false;
        for (var second in sustainsByChannelAndSecond[channel]) {
            sustainsByChannelAndSecond[channel][second].forEach(function (sustain) {
                if (isOn) {
                    if (!sustain.isOn) {
                        isOn = false;
                        sustainPeriods[sustainPeriods.length - 1].end = sustain.timestamp;
                    }
                }
                else {
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
    };
    for (var channel in sustainsByChannelAndSecond) {
        _loop_3(channel);
    }
    return sustainPeriods;
};
var parseAllControlEvents = function (tracks) {
    var controlEvents = {};
    tracks.forEach(function (track) {
        track.forEach(function (event) {
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
