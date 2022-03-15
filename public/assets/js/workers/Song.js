"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultChannels = exports.findOffNote = exports.setNotesBySecond = void 0;
var CONST_1 = require("./CONST");
var Song = /** @class */ (function () {
    function Song(midiData, fileName, name, copyright, onready) {
        this.fileName = fileName;
        this.name = name || fileName;
        this.copyright = copyright || '';
        this.onready = onready;
        this.text = [];
        this.timeSignatures = [];
        this.keySignatures = [];
        this.notesBySeconds = {};
        this.controlEvents = {};
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
    Song.prototype.clear = function () { };
    /**
     * 노래가 시작하는 시간(ms)을 리턴함
     * @method getStart
     */
    Song.prototype.getStart = function () {
        return this.getNoteSequence()[0].timestamp;
    };
    /**
     * 노래가 끝나는 시간(ms)을 리턴함
     * @method getEnd
     * */
    Song.prototype.getEnd = function () {
        if (!this.end) {
            var noteSequence = this.getNoteSequence().sort(function (a, b) { return a.offTime - b.offTime; });
            var lastNote = noteSequence[noteSequence.length - 1];
            this.end = lastNote.offTime;
        }
        return this.end;
    };
    Song.prototype.getOffset = function () {
        if (!this.smpteOffset) {
            return 0; //
        }
        else {
            return ((this.smpteOffset.hour * 60 + this.smpteOffset.min) * 60 + this.smpteOffset.sec) * 1000;
        }
    };
    Song.prototype.getMeasureLines = function () {
        if (!this.measureLines) {
            this.setMeasureLines();
        }
        return this.measureLines;
    };
    /* TODO: 현재 첫번째 time signature만 반환함. 추후에 수정 */
    Song.prototype.getTimeSignature = function () {
        //TODO handle multple timesignature within a song
        if (this.timeSignatures instanceof Array) {
            return this.timeSignatures[0];
        }
        return {
            type: 'timeSignature',
            meta: true,
            deltaTime: 0,
            timestamp: 0,
            numerator: 4,
            denominator: 4,
            thirtySeconds: 8,
            metronome: 24,
            id: 0,
            temporalDelta: 0,
        };
    };
    /* TODO: 현재 첫번째 key signature만 반환함. 추후에 수정 */
    Song.prototype.getKeySignature = function () {
        if (this.keySignatures.length) {
            return this.keySignatures[0];
        }
        return {
            scale: 0,
            key: 0,
        };
    };
    Song.prototype.setMeasureLines = function () {
        var _this = this;
        var timeSignature = this.getTimeSignature();
        var numerator = timeSignature.numerator || 4;
        var denominator = timeSignature.denominator || 4;
        var thirtySeconds = timeSignature.thirtySeconds || 8;
        var beatsToSkip = numerator * (4 / denominator);
        // const beatsPerMeasure = numerator / (denominator * (thirtySeconds / 32))
        var skippedBeats = beatsToSkip - 1;
        this.measureLines = {};
        var lastBeatTime = 0;
        Object.keys(this.temporalData.beatsBySecond).forEach(function (second) {
            _this.temporalData.beatsBySecond[second].forEach(function (beat) {
                var beatDuration = beat[0] - lastBeatTime;
                lastBeatTime = beat[0];
                if (skippedBeats < beatsToSkip - 1) {
                    skippedBeats++;
                    return;
                }
                skippedBeats -= beatsToSkip - 1;
                var adjust = skippedBeats != 0 ? skippedBeats * beatDuration : 0;
                var beatSecond = Math.floor((beat[0] - adjust) / 1000);
                //dont count beats that come after the last note.
                if (beat[0] < _this.getEnd()) {
                    if (!_this.measureLines.hasOwnProperty(beatSecond)) {
                        _this.measureLines[beatSecond] = [];
                    }
                    _this.measureLines[beatSecond].push([beat[0] - adjust, Math.floor(beat[1] / beatsToSkip) + 1]);
                }
            });
        });
    };
    Song.prototype.setSustainPeriods = function () {
        var _this = this;
        this.sustainPeriods = [];
        var _loop_1 = function (channel) {
            var isOn = false;
            for (var second in this_1.sustainsByChannelAndSecond[channel]) {
                this_1.sustainsByChannelAndSecond[channel][second].forEach(function (sustain) {
                    if (isOn) {
                        if (!sustain.isOn) {
                            isOn = false;
                            _this.sustainPeriods[_this.sustainPeriods.length - 1].end = sustain.timestamp;
                        }
                    }
                    else {
                        if (sustain.isOn) {
                            isOn = true;
                            _this.sustainPeriods.push({
                                start: sustain.timestamp,
                                value: sustain.value,
                                channel: channel,
                            });
                        }
                    }
                });
            }
        };
        var this_1 = this;
        for (var channel in this.sustainsByChannelAndSecond) {
            _loop_1(channel);
        }
    };
    Song.prototype.getMicrosecondsPerBeat = function () {
        return this.microSecondsPerBeat;
    };
    Song.prototype.getBPM = function (time) {
        for (var i = this.temporalData.bpms.length - 1; i >= 0; i--) {
            if (this.temporalData.bpms[i].timestamp < time) {
                return this.temporalData.bpms[i].bpm;
            }
        }
    };
    /* from 초부터 to초까지의 노트들을 반환함. ms가 아닌 s단위 */
    Song.prototype.getNotes = function (from, to) {
        var secondStart = Math.floor(from);
        var secondEnd = Math.floor(to);
        var notes = [];
        for (var i = secondStart; i < secondEnd; i++) {
            for (var track in this.activeTracks) {
                if (this.activeTracks[track].notesBySeconds.hasOwnProperty(i)) {
                    for (var n in this.activeTracks[track].notesBySeconds[i]) {
                        var note = this.activeTracks[track].notesBySeconds[i][n];
                        if (note.timestamp > from) {
                            notes.push(note);
                        }
                    }
                }
            }
        }
        return notes;
    };
    Song.prototype.parseAllControlEvents = function () {
        var _this = this;
        this.tracks.forEach(function (track) {
            track.forEach(function (event) {
                if (event.type == 'controller' && event.controllerType == 7) {
                    if (!_this.controlEvents.hasOwnProperty(Math.floor(event.timestamp / 1000))) {
                        _this.controlEvents[Math.floor(event.timestamp / 1000)] = [];
                    }
                    _this.controlEvents[Math.floor(event.timestamp / 1000)].push(event);
                }
            });
        });
    };
    Song.prototype.getAllInstruments = function () {
        var _this = this;
        var instruments = {};
        this.controlEvents = {};
        this.tracks.forEach(function (track) {
            _this.getAllInstrumentsOfTrack(track).forEach(function (instrumentId) { return (instruments[instrumentId] = true); });
        });
        return Object.keys(instruments);
    };
    /**
     * 이름과는 달리 프로퍼티를 설정하는 부분이 있다.
     */
    Song.prototype.getAllInstrumentsOfTrack = function (track) {
        var instruments = {};
        var programs = {};
        track.forEach(function (event) {
            // let channel = event.channel;
            // if (event.type == 'programChange') {
            //   programs[channel] = event.programNumber;
            // }
            // if (event.type == 'noteOn' || event.type == 'noteOff') {
            //   if (channel != 9) {
            //     let program = programs[channel];
            //     let instrument = CONST.INSTRUMENTS.BY_ID[isFinite(program) ? program : channel];
            //     instruments[instrument.id] = true;
            //     event.instrument = instrument.id;
            //   } else {
            //     instruments['percussion'] = true;
            //     event.instrument = 'percussion';
            //   }
            // }
            var channel;
            switch (event.type) {
                case 'programChange':
                    channel = event.channel;
                    programs[channel] = event.programNumber;
                    break;
                case 'noteOn':
                case 'noteOff':
                    channel = event.channel;
                    if (channel != 9) {
                        var program = programs[channel];
                        var instrument = CONST_1.default.INSTRUMENTS.BY_ID[isFinite(program) ? program : channel];
                        instruments[instrument.id] = true;
                        event.instrument = instrument.id;
                    }
                    else {
                        instruments['percussion'] = true;
                        event.instrument = 'percussion';
                    }
                    break;
            }
        });
        return Object.keys(instruments);
    };
    Song.prototype.processEvents = function (midiData) {
        var _this = this;
        midiData.trackInstruments = {};
        midiData.tracks.forEach(function (track, trackIndex) {
            midiData.trackInstruments[trackIndex] = _this.getAllInstrumentsOfTrack(track);
        });
        var songWorker = new Worker('./js/SongWorker.js');
        songWorker.onmessage = function (ev) {
            var dat = JSON.parse(ev.data);
            _this.sustainPeriods = dat.sustainPeriods;
            _this.activeTracks = dat.activeTracks;
            _this.otherTracks = dat.otherTracks;
            _this.longNotes = dat.longNotes;
            _this.controlEvents = dat.controlEvents;
            _this.text = dat.otherParams.text;
            _this.markers = dat.otherParams.markers;
            _this.timeSignatures = dat.otherParams.timeSignatures;
            _this.keySignatures = dat.otherParams.keySignatures;
            _this.smpteOffset = dat.otherParams.smpteOffset;
            _this.ready = true;
            _this.getMeasureLines();
            _this.onready(_this);
            // TODO: Sheet 생기면 주석 해제
            // if (getSetting('enableSheet')) this.generateSheet();
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
        songWorker.onerror = function (e) {
            console.error(e);
        };
        songWorker.postMessage(JSON.stringify(midiData));
    };
    Song.prototype.generateSheet = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // TODO: loader 생기면 주석 해제
                    // getLoader().startLoad();
                    // getLoader().setLoadMessage('Generating Sheet from MIDI');
                    return [4 /*yield*/, this.getSheet()];
                    case 1:
                        // TODO: loader 생기면 주석 해제
                        // getLoader().startLoad();
                        // getLoader().setLoadMessage('Generating Sheet from MIDI');
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Song.prototype.getSheet = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.sheetGen) {
                    this.sheetGen.clear();
                    this.sheetGen = null;
                    console.log('cleared sheet');
                }
                if (!this.sheetGen) {
                    console.log('creating sheet');
                    // TODO: sheetGen 생기면 주석 해제
                    // this.sheetGen = new SheetGenerator(
                    //   this.getMeasureLines(),
                    //   this.getTimeSignature().numerator,
                    //   this.getTimeSignature().denominator,
                    //   this.getKeySignature(),
                    //   this.getEnd(),
                    // );
                    console.log(this.sheetGen);
                }
                return [2 /*return*/];
            });
        });
    };
    /* 이벤트들을 타입에 맞게 분배한다. */
    Song.prototype.distributeEvents = function (track, newTrack) {
        var _this = this;
        // {
        //   notes: [],
        //   meta: [],
        //   tempoChanges: [],
        // }
        track.forEach(function (event) {
            event.id = _this.idCounter++;
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
                _this.text.push(event.text);
            }
            else if (event.type == 'timeSignature') {
                _this.timeSignatures.push(event);
            }
            else if (event.type == 'keySignature') {
                newTrack.keySignature = event;
                _this.keySignatures.push(event);
            }
            else if (event.type == 'smpteOffset') {
                _this.smpteOffset = event;
            }
            else if (event.type == 'marker') {
                _this.markers.push(event);
            }
            else {
                // TODO: 위에서 처리하는 것들을 제외한 나머지 이벤트들은 meta에 넣는다. 이게 좋을 것 같진 않음. 나중에 수정해야 함
                // @ts-ignore
                newTrack.meta.push(event);
            }
        });
    };
    Song.prototype.getNoteSequence = function () {
        if (!this.notesSequence) {
            var tracks = [];
            for (var t in this.activeTracks)
                tracks.push(this.activeTracks[t].notes);
            // TODO: 알아보기 쉽게 바꿨는데, 문제가 생기면 다시 바꿔야함
            this.noteSequence = __spreadArray([], tracks.flat(), true).sort(function (a, b) { return a.timestamp - b.timestamp; });
            // this.noteSequence = [].concat.apply([], tracks).sort((a, b) => a.timestamp - b.timestamp);
        }
        return this.noteSequence.slice(0);
    };
    Song.prototype.getNoteRange = function () {
        var seq = this.getNoteSequence();
        var min = 87;
        var max = 0;
        seq.forEach(function (note) {
            if (note.noteNumber > max) {
                max = note.noteNumber;
            }
            if (note.noteNumber < min) {
                min = note.noteNumber;
            }
        });
        return { min: min, max: max };
    };
    Song.prototype.setNoteSustainTimestamps = function (notes) {
        var _loop_2 = function (i) {
            var note = notes[i];
            var currentSustains = this_2.sustainPeriods
                .filter(function (period) { return parseInt(period.channel, 10) === note.channel; })
                .filter(function (period) {
                return (period.start < note.timestamp && period.end > note.timestamp) ||
                    (period.start < note.offTime && period.end > note.offTime);
            });
            if (Array.isArray(currentSustains) && currentSustains.length > 0) {
                note.sustainOnTime = currentSustains[0].start;
                var end = Math.max.apply(null, currentSustains.map(function (sustain) { return sustain.end; }));
                note.sustainOffTime = end;
                note.sustainDuration = note.sustainOffTime - note.timestamp;
            }
        };
        var this_2 = this;
        for (var i = 0; i < notes.length; i++) {
            _loop_2(i);
        }
    };
    /* TODO: 현재까지는 아무 쓸모 없어 보임. */
    Song.prototype.setNoteOffTimestamps = function (notes) {
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            if (note.type == 'noteOn') {
                findOffNote(i, notes.slice(0));
            }
        }
    };
    return Song;
}());
exports.default = Song;
function setNotesBySecond(track) {
    track.notes.forEach(function (note) {
        var second = Math.floor(note.timestamp / 1000);
        if (track.notesBySeconds.hasOwnProperty(second)) {
            track.notesBySeconds[second].push(note);
        }
        else {
            track.notesBySeconds[second] = [note];
        }
    });
}
exports.setNotesBySecond = setNotesBySecond;
function findOffNote(index, notes) {
    var onNote = notes[index];
    for (var i = index + 1; i < notes.length; i++) {
        /* TODO: 원래 아래처럼 noteOff 조건이 들어가 있었는데, 왜 이렇게 되어 있었는지 모르겠음. 호출하는 조건은 noteOn이라 사실상 항상 false임. */
        // if (notes[i].type === 'noteOff' && onNote.noteNumber === notes[i].noteNumber) {
        if (onNote.noteNumber === notes[i].noteNumber) {
            onNote.offTime = notes[i].timestamp;
            onNote.offVelocity = notes[i].velocity;
            onNote.duration = onNote.offTime - onNote.timestamp;
            break;
        }
    }
}
exports.findOffNote = findOffNote;
function getDefaultChannels() {
    var channels = {};
    for (var i = 0; i <= 15; i++) {
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
exports.getDefaultChannels = getDefaultChannels;
