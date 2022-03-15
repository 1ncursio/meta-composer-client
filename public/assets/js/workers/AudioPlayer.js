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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioPlayer = void 0;
var AudioNote_1 = require("./AudioNote");
var Buffers_1 = require("./Buffers");
var SoundFontLoader_1 = require("./SoundFontLoader");
var Tracks_1 = require("./Tracks");
var AudioPlayer = /** @class */ (function () {
    function AudioPlayer() {
        this.context = new AudioContext();
        this.buffers = {};
        this.audioNotes = [];
        this.soundfontName = 'MusyngKite';
        this.convolverNode = this.context.createConvolver();
        // TODO: 메트로놈 사용가능하게 하기
        // this.loadMetronomeSounds();
        // TODO: setting 설정 추가하면 주석 삭제
        // if (getSetting('enableReverb')) {
        //   this.reverbEnabled = true;
        //   this.setReverb();
        // } else {
        //   this.reverbEnabled = false;
        // }
        this.reverbEnabled = false;
        this.wasSuspended = false;
        this.metronomSound1 = null;
        this.metronomSound2 = null;
        this.loading = false;
        // TODO: setting 설정 추가하면 주석 삭제
        // setSettingCallback('reverbImpulseResponse', this.setReverb.bind(this));
        // setSettingCallback('enableReverb', () => {
        //   this.reverbEnabled = getSetting('enableReverb');
        //   if (this.reverbEnabled) {
        // this.getConvolver().buffer = null;
        // this.setReverb();
        //   } else {
        // this.getConvolver().disconnect();
        //   }
        // });
    }
    AudioPlayer.prototype.cleanEndedNotes = function () {
        var _this = this;
        this.audioNotes = this.audioNotes.filter(function (audioNote) { return !audioNote.deleteAt || audioNote.deleteAt > _this.context.currentTime; });
    };
    AudioPlayer.prototype.getConvolver = function () {
        if (!this.convolverNode) {
            this.convolverNode = this.context.createConvolver();
            this.convolverNode.normalize = true;
        }
        return this.convolverNode;
    };
    AudioPlayer.prototype.setReverb = function () {
        var _this = this;
        // TODO: setting 바꾸면 수정
        var reverb = 'SteinmanHall';
        // let reverb = getSetting('reverbImpulseResponse');
        this.loadImpulseBuffer('../../Reverb/' + reverb + '.wav').then(function (result) {
            _this.getConvolver().buffer = result;
            _this.getConvolver().connect(_this.context.destination);
        });
    };
    AudioPlayer.prototype.getContextTime = function () {
        return this.context.currentTime;
    };
    AudioPlayer.prototype.getContext = function () {
        return this.context;
    };
    AudioPlayer.prototype.isRunning = function () {
        return this.context.state == 'running';
    };
    AudioPlayer.prototype.resume = function () {
        this.context.resume();
    };
    AudioPlayer.prototype.suspend = function () {
        this.context.suspend();
    };
    AudioPlayer.prototype.stopAllSources = function () {
        this.audioNotes.forEach(function (audioNote) {
            try {
                audioNote.source.stop(0);
            }
            catch (error) {
                console.log(error);
                //Lets ignore this. Happens when notes are created while jumping on timeline
            }
        });
        this.audioNotes = [];
    };
    AudioPlayer.prototype.loadImpulseBuffer = function (impulseUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(impulseUrl)
                        .then(function (response) { return response.arrayBuffer(); })
                        .then(function (arrayBuffer) { return _this.context.decodeAudioData(arrayBuffer); })];
            });
        });
    };
    AudioPlayer.prototype.getSoundfontName = function (instrument) {
        var soundfontName = this.soundfontName;
        if (instrument === 'percussion') {
            soundfontName = 'FluidR3_GM';
        }
        // TODO: 이 세팅은 안쓸듯
        // if (instrument === 'acoustic_grand_piano' && getSetting('useHQPianoSoundfont')) {
        //   soundfontName = 'HQSoundfont';
        // }
        return soundfontName;
    };
    AudioPlayer.prototype.createContinuousNote = function (noteNumber, volume, instrument) {
        if (this.context.state === 'suspended') {
            this.wasSuspended = true;
            this.context.resume();
        }
        var audioNote = (0, AudioNote_1.createContinuousAudioNote)(this.context, (0, Buffers_1.getBufferForNote)(this.getSoundfontName(instrument), instrument, noteNumber), volume / 100, this.getDestination());
        return audioNote;
    };
    AudioPlayer.prototype.noteOffContinuous = function (audioNote) {
        audioNote.endAt(this.context.currentTime + 0.1, false);
    };
    AudioPlayer.prototype.playCompleteNote = function (currentTime, note, playbackSpeed, volume, isPlayAlong) {
        var instrument = (0, Tracks_1.getTrack)(note.track).overwrittenInstrument || note.instrument;
        // if (getTrack(note.track).overwrittenInstrument) {
        //   instrument = getTrack(note.track).overwrittenInstrument;
        // }
        // let soundfontName = this.soundfontName;
        // TODO: setting 설정 추가하면 주석 삭제
        // if (instrument == 'acoustic_grand_piano' && getSetting('useHQPianoSoundfont')) {
        //   soundfontName = 'HQSoundfont';
        // }
        var buffer = (0, Buffers_1.getBufferForNote)(this.getSoundfontName(instrument), instrument, note.noteNumber);
        var audioNote = (0, AudioNote_1.createCompleteAudioNote)(note, currentTime, playbackSpeed, volume, isPlayAlong, this.context, buffer, this.getDestination());
        this.audioNotes.push(audioNote);
    };
    AudioPlayer.prototype.getDestination = function () {
        if (this.reverbEnabled) {
            return this.getConvolver();
        }
        else {
            return this.context.destination;
        }
    };
    AudioPlayer.prototype.playBeat = function (time, newMeasure) {
        if (time < 0)
            return;
        this.context.resume();
        var ctxTime = this.context.currentTime;
        var source = this.context.createBufferSource();
        var gainNode = this.context.createGain();
        // TODO: setting 설정 추가하면 주석 삭제
        // gainNode.gain.value = getSetting('metronomeVolume');
        gainNode.gain.value = 0.1;
        source.buffer = newMeasure ? this.metronomSound1 : this.metronomSound2;
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        source.start(ctxTime + time);
        source.stop(ctxTime + time + 0.2);
    };
    // TODO: Soundfount 여러가지 설정 가능하도록 하기
    //   async switchSoundfont(soundfontName, currentSong) {
    //     this.soundfontName = soundfontName;
    //     getLoader().setLoadMessage('Loading Instruments');
    //     await this.loadInstrumentsForSong(currentSong);
    //     getLoader().setLoadMessage('Loading Buffers');
    //     return await this.loadBuffers();
    //   }
    // TODO: 메트로놈 사용 여부 가능하도록 하기
    // loadMetronomeSounds() {
    //   let audioPl = this;
    //   const request = new XMLHttpRequest();
    //   request.open('GET', '../../metronome/1.wav');
    //   request.responseType = 'arraybuffer';
    //   request.onload = function () {
    //     let undecodedAudio = request.response;
    //     audioPl.context.decodeAudioData(undecodedAudio, (data) => (audioPl.metronomSound1 = data));
    //   };
    //   request.send();
    //   const request2 = new XMLHttpRequest();
    //   request2.open('GET', '../../metronome/2.wav');
    //   request2.responseType = 'arraybuffer';
    //   request2.onload = function () {
    //     let undecodedAudio = request2.response;
    //     audioPl.context.decodeAudioData(undecodedAudio, (data) => (audioPl.metronomSound2 = data));
    //   };
    //   request2.send();
    // }
    AudioPlayer.prototype.loadInstrumentsForSong = function (currentSong) {
        return __awaiter(this, void 0, void 0, function () {
            var instrumentsOfSong, instrumentSoundfontMap, tracks, neededInstruments;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.buffers.hasOwnProperty(this.soundfontName)) {
                            this.buffers[this.soundfontName] = {};
                        }
                        instrumentsOfSong = currentSong.getAllInstruments();
                        instrumentSoundfontMap = {};
                        instrumentsOfSong.forEach(function (instrument) {
                            instrumentSoundfontMap[instrument] = _this.soundfontName;
                        });
                        // instrumentSoundfontMap[getSetting('inputInstrument')] = this.soundfontName;
                        instrumentSoundfontMap['acoustic_grand_piano'] = this.soundfontName;
                        tracks = (0, Tracks_1.getTracks)();
                        Object.keys(tracks)
                            .map(function (trackId) { return tracks[parseInt(trackId)]; })
                            .filter(function (track) { return track.hasOwnProperty('overwrittenInstrument'); })
                            .filter(function (track) { return !instrumentsOfSong.includes(track.overwrittenInstrument); })
                            .forEach(function (track) { return (instrumentSoundfontMap[track.overwrittenInstrument] = _this.soundfontName); });
                        if (instrumentSoundfontMap.hasOwnProperty('percussion')) {
                            instrumentSoundfontMap['percussion'] = 'FluidR3_GM';
                        }
                        neededInstruments = Object.entries(instrumentSoundfontMap)
                            .filter(function (entry) { return !_this.isInstrumentLoaded(entry[0]); })
                            .map(function (entry) { return SoundFontLoader_1.SoundfontLoader.loadInstrument(entry[0], entry[1]); });
                        if (neededInstruments.length == 0) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, Promise.all(neededInstruments)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AudioPlayer.prototype.isInstrumentLoaded = function (instrument) {
        return (0, Buffers_1.hasBuffer)(this.getSoundfontName(instrument), instrument);
    };
    AudioPlayer.prototype.loadInstrument = function (instrument) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SoundFontLoader_1.SoundfontLoader.loadInstrument(instrument, this.soundfontName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadBuffers()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AudioPlayer.prototype.loadBuffers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SoundFontLoader_1.SoundfontLoader.getBuffers(this.context).then(function (buffers) {
                            console.log('Buffers loaded');
                            _this.loading = false;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AudioPlayer;
}());
exports.AudioPlayer = AudioPlayer;
