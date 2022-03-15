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
exports.START_DELAY = void 0;
var AudioPlayer_1 = require("./AudioPlayer");
var MidiLoader_1 = require("./MidiLoader");
var Song_1 = require("./Song");
var Tracks_1 = require("./Tracks");
var LOOK_AHEAD_TIME = 0.2;
var LOOK_AHEAD_TIME_WHEN_PLAYALONG = 0.02;
exports.START_DELAY = -4.5;
var Player = /** @class */ (function () {
    function Player() {
        this.audioPlayer = new AudioPlayer_1.AudioPlayer();
        // TODO: MidiHandler 에서 이벤트 받아서 처리하도록 변경
        // getMidiHandler().setNoteOnCallback(this.addInputNoteOn.bind(this));
        // getMidiHandler().setNoteOffCallback(this.addInputNoteOff.bind(this));
        this.lastTime = this.audioPlayer.getContextTime();
        this.progress = 0;
        this.paused = true;
        this.wasPaused = true;
        this.playing = false;
        this.scrolling = 0;
        this.loadedSongs = new Set();
        this.muted = false;
        this.volume = 100;
        this.mutedAtVolume = 100;
        this.scrollOffset = 0;
        this.song = null;
        this.noteSequence = [];
        this.loading = true;
        // TODO: setting 설정 추가하면 주석 삭제
        // this.soundfontName = getSetting('soundfontName');
        // this.useHqPiano = getSetting('useHQPianoSoundfont');
        this.soundfontName = 'MusyngKite';
        this.useHqPiano = false;
        this.inputInstrument = 'acoustic_grand_piano';
        this.lastMicNote = -1;
        this.newSongCallbacks = [];
        this.inputActiveNotes = {};
        this.inputPlayedNotes = [];
        this.longNotes = {};
        this.pauseTime = 0;
        this.playbackSpeed = 1;
        console.log('Player created.');
        this.playTick();
        // TODO: setting 설정 추가하면 주석 삭제
        // setSettingCallback('hideRestsBelow', () => {
        //   if (this.song && getSetting('enableSheet')) {
        //     this.song.generateSheet();
        //   }
        // });
        // TODO: 악보 추가되면 주석 해제
        // this.song.generateSheet();
    }
    Player.getInstance = function () {
        return this.instance || (this.instance = new this());
    };
    Player.prototype.getState = function () {
        var _a, _b;
        var time = this.getTime();
        var songReady = this.song && this.song.ready;
        return {
            time: time,
            ctxTime: this.audioPlayer.getContextTime(),
            end: songReady ? (_a = this.song) === null || _a === void 0 ? void 0 : _a.getEnd() : 0,
            loading: this.audioPlayer.loading,
            song: this.song,
            inputActiveNotes: this.inputActiveNotes,
            inputPlayedNotes: this.inputPlayedNotes,
            bpm: this.getBPM(time),
            longNotes: songReady ? (_b = this.song) === null || _b === void 0 ? void 0 : _b.longNotes : {},
        };
    };
    Player.prototype.addNewSongCallback = function (callback) {
        this.newSongCallbacks.push(callback);
    };
    // TODO: setting 설정 추가하면 주석 삭제
    // switchSoundfont(soundfontName: string) {
    //   this.wasPaused = this.paused;
    //   this.pause();
    //   // getLoader().startLoad();
    //   let nowTime = window.performance.now();
    //   this.soundfontName = soundfontName;
    //   this.audioPlayer.switchSoundfont(soundfontName, this.song).then((resolve) => {
    //     window.setTimeout(() => {
    //       if (!this.wasPaused) {
    //         this.resume();
    //       }
    //       // getLoader().stopLoad();
    //     }, Math.max(0, 500 - (window.performance.now() - nowTime)));
    //   });
    // }
    Player.prototype.getTimeWithScrollOffset = function (scrollOffset) {
        return this.progress + exports.START_DELAY - scrollOffset;
    };
    Player.prototype.getTime = function () {
        return this.progress + exports.START_DELAY - this.scrollOffset;
    };
    Player.prototype.getTimeWithoutScrollOffset = function () {
        return this.progress + exports.START_DELAY;
    };
    Player.prototype.setTime = function (seconds) {
        this.audioPlayer.stopAllSources();
        this.progress += seconds - this.getTime();
        this.resetNoteSequence();
    };
    Player.prototype.increaseSpeed = function (val) {
        this.playbackSpeed = Math.max(0, Math.round((this.playbackSpeed + val) * 100) / 100);
    };
    Player.prototype.getChannel = function (track) {
        if (this.song.activeTracks[track].notes.length) {
            return this.channels[this.song.activeTracks[track].notes[0].channel];
        }
    };
    Player.prototype.getCurrentTrackInstrument = function (trackIndex) {
        var noteSeq = this.song.getNoteSequence();
        var i = 0;
        var nextNote = noteSeq[i];
        while (nextNote.track !== trackIndex && i < noteSeq.length - 1) {
            i++;
            nextNote = noteSeq[i];
        }
        if (nextNote.track == trackIndex) {
            return nextNote.instrument;
        }
    };
    Player.prototype.loadSong = function (theSong, fileName, name, copyright) {
        return __awaiter(this, void 0, void 0, function () {
            var midiFile, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.audioPlayer.stopAllSources();
                        // getLoader().startLoad();
                        // getLoader().setLoadMessage('Loading ' + name ? name : fileName + '.');
                        if (this.audioPlayer.isRunning()) {
                            this.audioPlayer.suspend();
                        }
                        this.loading = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, MidiLoader_1.default.loadFile(theSong)];
                    case 2:
                        midiFile = _a.sent();
                        if (!midiFile) {
                            throw new Error('Midi file is not loaded.');
                        }
                        //clean up previous song
                        if (Player.getInstance().song) {
                            // TODO: 악보 추가되면 주석 해제
                            // Player.getInstance().song!.sheetGen.clear();
                            // TODO: setSong을 하면서 초기화될텐데 이거 왜 하는거지?
                            // for (let key in getPlayer().song) {
                            //   getPlayer().song[key] = null;
                            // }
                            // getPlayer().song = null;
                            // delete getPlayer().song;
                        }
                        //create song obj. When songWorker is done processing, this.setSong will be called.
                        new Song_1.default(midiFile, fileName, name || '', copyright || '', function (song) {
                            console.log({ song: song });
                            _this.setSong(song);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.loadInstrumentsForSong = function (song) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // getLoader().setLoadMessage('Loading Instruments');
                    return [4 /*yield*/, this.audioPlayer.loadInstrumentsForSong(song)];
                    case 1:
                        // getLoader().setLoadMessage('Loading Instruments');
                        _a.sent();
                        // getLoader().setLoadMessage('Creating Buffers');
                        return [2 /*return*/, this.audioPlayer.loadBuffers().then(function (v) {
                                // getLoader().stopLoad();
                            })];
                }
            });
        });
    };
    Player.prototype.loadInputInstrument = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wasPaused_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.audioPlayer.isInstrumentLoaded(this.inputInstrument)) return [3 /*break*/, 2];
                        console.log('Loading input instrument:' + this.inputInstrument);
                        wasPaused_1 = this.paused;
                        this.pause();
                        return [4 /*yield*/, this.audioPlayer.loadInstrument(this.inputInstrument).then(function (resolve) {
                                if (!wasPaused_1) {
                                    _this.resume();
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.checkAllInstrumentsLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.loadInstrumentsForSong(this.song)];
            });
        });
    };
    Player.prototype.setSong = function (song) {
        this.pause();
        this.playing = false;
        this.paused = true;
        this.wasPaused = true;
        this.progress = 0;
        this.scrollOffset = 0;
        this.song = song;
        if (this.loadedSongs.has(song)) {
            this.loadedSongs.add(song);
        }
        (0, Tracks_1.setupTracks)(song.activeTracks);
        this.loadInstrumentsForSong(this.song);
        this.newSongCallbacks.forEach(function (callback) { return callback(); });
    };
    Player.prototype.startPlay = function () {
        console.log('Starting Song');
        this.wasPaused = false;
        this.resetNoteSequence();
        this.lastTime = this.audioPlayer.getContextTime();
        this.resume();
    };
    Player.prototype.handleScroll = function (stacksize) {
        var _this = this;
        if (this.scrolling != 0) {
            if (!this.song) {
                this.scrolling = 0;
                return;
            }
            this.lastTime = this.audioPlayer.getContextTime();
            var newScrollOffset = this.scrollOffset + 0.01 * this.scrolling;
            //get hypothetical time with new scrollOffset.
            var oldTime = this.getTimeWithScrollOffset(this.scrollOffset);
            var newTime = this.getTimeWithScrollOffset(newScrollOffset);
            //limit scroll past end
            if (this.song && newTime > 1 + this.song.getEnd() / 1000) {
                this.scrolling = 0;
                newScrollOffset = this.getTimeWithoutScrollOffset() - (1 + this.song.getEnd() / 1000);
                this.scrollOffset + (1 + this.song.getEnd() / 1000 - this.getTime()) || this.scrollOffset;
            }
            //limit scroll past beginning
            if (newTime < oldTime && newTime < exports.START_DELAY) {
                this.scrolling = 0;
                newScrollOffset = this.getTimeWithoutScrollOffset() - exports.START_DELAY;
            }
            this.scrollOffset = newScrollOffset;
            //dampen scroll amount somehow...
            this.scrolling =
                (Math.abs(this.scrolling) - Math.max(Math.abs(this.scrolling * 0.003), this.playbackSpeed * 0.001)) *
                    (Math.abs(this.scrolling) / this.scrolling) || 0;
            //set to zero if only minimal scrollingspeed left
            if (Math.abs(this.scrolling) <= this.playbackSpeed * 0.005) {
                this.scrolling = 0;
                this.resetNoteSequence();
            }
            //limit recursion
            if (!stacksize)
                stacksize = 0;
            if (stacksize > 50) {
                window.setTimeout(function () {
                    _this.handleScroll();
                }, 25);
                return;
            }
            this.handleScroll(++stacksize);
            return;
        }
    };
    Player.prototype.addLongNote = function (note) {
        if (!this.longNotes) {
            this.longNotes = {};
        }
        if (!this.longNotes.hasOwnProperty(note.track)) {
            this.longNotes[note.track] = [];
        }
        this.longNotes[note.track].push(note);
    };
    Player.prototype.checkLongNotes = function () {
        var _this = this;
        Object.keys(this.longNotes).forEach(function (trackIndex) {
            for (var i = _this.longNotes[trackIndex].length - 1; i >= 0; i--) {
                // TODO: 일단 잘못된 윗 코드에서 아래 코드로 수정했는데, 작동안하면 되돌려야 함
                // if (this.longNotes[trackIndex].offTime < this.getTime()) {
                if (_this.longNotes[trackIndex][i].offTime < _this.getTime()) {
                    _this.longNotes[trackIndex].splice(i, 1);
                }
            }
        });
    };
    Player.prototype.getBPM = function (time) {
        var val = 0;
        if (this.song) {
            for (var i = this.song.temporalData.bpms.length - 1; i >= 0; i--) {
                if (time * 1000 > this.song.temporalData.bpms[i].timestamp) {
                    val = this.song.temporalData.bpms[i].bpm;
                    break;
                }
            }
        }
        return val;
    };
    Player.prototype.playTick = function () {
        var currentContextTime = this.audioPlayer.getContextTime();
        this.audioPlayer.cleanEndedNotes();
        var delta = (currentContextTime - this.lastTime) * this.playbackSpeed;
        // TODO: 마이크 인풋 받기인데 필요없을 듯
        //Setting doesnt exist yet. Pitch detection is too bad for a whole piano.
        // this.addMicInputNotes();
        //cap max updaterate.
        if (delta < 0.0069) {
            this.requestNextTick();
            return;
        }
        // TODO: Settings 추가되면 주석 해제
        // if (this.checkSettingsChanged()) {
        //   this.requestNextTick();
        //   return;
        // }
        var oldProgress = this.progress;
        this.lastTime = currentContextTime;
        if (!this.paused && this.scrolling == 0) {
            this.progress += Math.min(0.1, delta);
        }
        else {
            this.requestNextTick();
            return;
        }
        var currentTime = this.getTime();
        if (this.song && this.isSongEnded(currentTime - 5)) {
            this.pause();
            this.requestNextTick();
            return;
        }
        // TODO: settings 추가되면 주석 해제
        // if (getSetting('enableMetronome')) {
        //   this.playMetronomeBeats(currentTime);
        // }
        while (this.isNextNoteReached(currentTime)) {
            var toRemove = 0;
            forLoop: for (var i = 0; i < this.noteSequence.length; i++) {
                if (currentTime > 0.05 + this.noteSequence[i].timestamp / 1000) {
                    toRemove++;
                }
                else {
                    break forLoop;
                }
            }
            if (toRemove > 0) {
                this.noteSequence.splice(0, toRemove);
            }
            if (this.noteSequence[0] &&
                (!(0, Tracks_1.isTrackRequiredToPlay)(this.noteSequence[0].track) || this.isInputKeyPressed(this.noteSequence[0].noteNumber))) {
                this.playNote(this.noteSequence.shift());
            }
            else {
                this.progress = oldProgress;
                break;
            }
        }
        this.requestNextTick();
    };
    // TODO: settings 설정하면 주석 제거
    // checkSettingsChanged() {
    //   let soundfontName = getSetting('soundfontName');
    //   let useHqPiano = getSetting('useHQPianoSoundfont');
    //   if (soundfontName != this.soundfontName || useHqPiano != this.useHqPiano) {
    //     this.useHqPiano = useHqPiano;
    //     this.switchSoundfont(soundfontName);
    //     return true;
    //   }
    //   let inputInstrumentName = getSetting('inputInstrument');
    //   if (inputInstrumentName != this.inputInstrument) {
    //     this.inputInstrument = inputInstrumentName;
    //     this.loadInputInstrument();
    //     return true;
    //   }
    // }
    Player.prototype.playMetronomeBeats = function (currentTime) {
        var _this = this;
        this.playedBeats = this.playedBeats || {};
        // let beatsBySecond = getCurrentSong().temporalData.beatsBySecond;
        var beatsBySecond = Player.getInstance().song.temporalData.beatsBySecond;
        var secondsToCheck = [Math.floor(currentTime), Math.floor(currentTime) + 1];
        secondsToCheck.forEach(function (second) {
            if (beatsBySecond[second]) {
                beatsBySecond[second].forEach(function (beat) {
                    var _a;
                    var beatTimestamp = beat[0];
                    if (!_this.playedBeats.hasOwnProperty(beatTimestamp) && beatTimestamp / 1000 < currentTime + 0.5) {
                        var newMeasure = (_a = Player.getInstance().song.measureLines[Math.floor(beatTimestamp / 1000)]) === null || _a === void 0 ? void 0 : _a.includes(beatTimestamp);
                        _this.playedBeats[beatTimestamp] = true;
                        _this.audioPlayer.playBeat((beatTimestamp / 1000 - currentTime) / _this.playbackSpeed, newMeasure);
                    }
                });
            }
        });
    };
    // TODO: 마이크 인풋 받기인데 필요없을 듯
    // addMicInputNotes() {
    //   if (getSetting('micInputEnabled')) {
    //     let currentMicNote = getCurrentMicNote();
    //     if (this.lastMicNote != currentMicNote) {
    //       if (this.lastMicNote > -1) {
    //         this.addInputNoteOff(this.lastMicNote);
    //       }
    //       if (currentMicNote > -1) {
    //         this.addInputNoteOn(currentMicNote);
    //       }
    //     }
    //     this.lastMicNote = currentMicNote;
    //   }
    // }
    Player.prototype.requestNextTick = function () {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.playTick(); });
    };
    Player.prototype.isInputKeyPressed = function (noteNumber) {
        if (this.inputActiveNotes.hasOwnProperty(noteNumber) && !this.inputActiveNotes[noteNumber].wasUsed) {
            this.inputActiveNotes[noteNumber].wasUsed = true;
            return true;
        }
        return false;
    };
    Player.prototype.isSongEnded = function (currentTime) {
        return currentTime >= this.song.getEnd() / 1000;
    };
    Player.prototype.isNextNoteReached = function (currentTime) {
        var lookahead = (0, Tracks_1.isAnyTrackPlayalong)() ? LOOK_AHEAD_TIME_WHEN_PLAYALONG : LOOK_AHEAD_TIME;
        return (this.noteSequence.length && this.noteSequence[0].timestamp / 1000 < currentTime + lookahead * this.playbackSpeed);
    };
    Player.prototype.stop = function () {
        this.progress = 0;
        this.scrollOffset = 0;
        this.playing = false;
        this.pause();
    };
    Player.prototype.resume = function () {
        if (!this.song || !this.paused)
            return;
        console.log('Resuming Song');
        this.paused = false;
        this.resetNoteSequence();
        this.audioPlayer.resume();
    };
    Player.prototype.resetNoteSequence = function () {
        var _this = this;
        this.noteSequence = this.song.getNoteSequence();
        this.noteSequence = this.noteSequence.filter(function (note) { return note.timestamp > _this.getTime(); });
        this.inputActiveNotes = {};
        this.playedBeats = {};
    };
    Player.prototype.pause = function () {
        console.log('Pausing Song');
        this.pauseTime = this.getTime();
        this.paused = true;
    };
    Player.prototype.playNote = function (note) {
        if (!note.hasOwnProperty('channel') || !note.hasOwnProperty('noteNumber')) {
            return;
        }
        var currentTime = this.getTime();
        // TODO: MidHandler 추가하면 주석 해제
        // if (getMidiHandler().isOutputActive()) {
        if (false) {
            // getMidiHandler().playNote(
            //   note.noteNumber + 21,
            //   note.velocity,
            //   note.offVelocity,
            //   (note.timestamp - currentTime * 1000) / this.playbackSpeed,
            //   (note.offTime - currentTime * 1000) / this.playbackSpeed,
            // );
        }
        else {
            this.audioPlayer.playCompleteNote(currentTime, note, this.playbackSpeed, this.getNoteVolume(note), (0, Tracks_1.isAnyTrackPlayalong)());
        }
    };
    Player.prototype.getNoteVolume = function (note) {
        return (this.volume / 100) * ((0, Tracks_1.getTrackVolume)(note.track) / 100) * (note.channelVolume / 127);
    };
    Player.prototype.addInputNoteOn = function (noteNumber) {
        if (this.inputActiveNotes.hasOwnProperty(noteNumber)) {
            console.log('NOTE ALREADY PLAING');
            this.audioPlayer.noteOffContinuous(this.inputActiveNotes[noteNumber].audioNote);
            delete this.inputActiveNotes[noteNumber];
        }
        var audioNote = this.audioPlayer.createContinuousNote(noteNumber, this.volume, this.inputInstrument);
        var activeNoteObj = {
            audioNote: audioNote,
            wasUsed: false,
            noteNumber: noteNumber,
            timestamp: this.audioPlayer.getContextTime() * 1000,
        };
        this.inputActiveNotes[noteNumber] = activeNoteObj;
    };
    Player.prototype.addInputNoteOff = function (noteNumber) {
        if (!this.inputActiveNotes.hasOwnProperty(noteNumber)) {
            console.log('NOTE NOT PLAYING');
            return;
        }
        this.audioPlayer.noteOffContinuous(this.inputActiveNotes[noteNumber].audioNote);
        this.inputActiveNotes[noteNumber].offTime = this.audioPlayer.getContextTime() * 1000;
        this.inputPlayedNotes.push(this.inputActiveNotes[noteNumber]);
        delete this.inputActiveNotes[noteNumber];
    };
    Player.prototype.skipForward = function () {
        this.setTime(this.getTime() + 3);
    };
    Player.prototype.skipBack = function () {
        this.setTime(this.getTime() - 3);
    };
    return Player;
}());
exports.default = Player;
// var thePlayer = null;
// export const initThePlayer = () => {
//   thePlayer = new Player();
// };
// export const getPlayer = () => {
//   return thePlayer;
// };
// export const getCurrentSong = () => {
//   return thePlayer.song;
// };
// export const getPlayerState = () => {
//   return thePlayer.getState();
// };
