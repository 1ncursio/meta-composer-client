"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompleteAudioNote = exports.createContinuousAudioNote = void 0;
// import { getSetting } from '../settings/Settings.js';
var GainNodeController_1 = require("./GainNodeController");
var AudioNote = /** @class */ (function () {
    function AudioNote(context, buffer) {
        this.source = context.createBufferSource();
        this.source.buffer = buffer;
        this.deleteAt = 0;
    }
    AudioNote.prototype.connectSource = function (gainNode, destination) {
        var _a;
        this.source.connect(gainNode);
        (_a = this.getGainNode()) === null || _a === void 0 ? void 0 : _a.connect(destination);
    };
    AudioNote.prototype.getGainNode = function () {
        var _a;
        return (_a = this.gainNodeController) === null || _a === void 0 ? void 0 : _a.gainNode;
    };
    AudioNote.prototype.suspend = function () {
        this.source.stop(0);
    };
    AudioNote.prototype.play = function (time) {
        this.source.start(time);
    };
    AudioNote.prototype.endAt = function (time, isSustained) {
        var _a, _b;
        // TODO: ?? time 부분에서 에러나면 수정해야 함
        var endTime = (_b = (_a = this.gainNodeController) === null || _a === void 0 ? void 0 : _a.endAt(time, isSustained)) !== null && _b !== void 0 ? _b : time;
        this.endSourceAt(endTime + 0.5);
    };
    AudioNote.prototype.endSourceAt = function (time) {
        this.source.stop(time + 10);
        this.deleteAt = time + 12;
    };
    return AudioNote;
}());
exports.default = AudioNote;
var createContinuousAudioNote = function (context, buffer, volume, destination) {
    var audioNote = new AudioNote(context, buffer);
    audioNote.gainNodeController = (0, GainNodeController_1.createContinuousGainNode)(context, context.currentTime, volume);
    audioNote.connectSource(audioNote.gainNodeController.gainNode, destination);
    audioNote.play(context.currentTime);
    return audioNote;
};
exports.createContinuousAudioNote = createContinuousAudioNote;
var createCompleteAudioNote = function (note, currentSongTime, playbackSpeed, volume, isPlayalong, context, buffer, destination) {
    var audioNote = new AudioNote(context, buffer);
    var gainValue = getNoteGain(note, volume);
    if (gainValue == 0) {
        return audioNote;
    }
    var contextTimes = getContextTimesForNote(context, note, currentSongTime, playbackSpeed, isPlayalong);
    var isSustained = true && contextTimes.end < contextTimes.sustainOff;
    // const isSustained = getSetting('sustainEnabled') && contextTimes.end < contextTimes.sustainOff;
    audioNote.gainNodeController = (0, GainNodeController_1.createCompleteGainNode)(context, gainValue, contextTimes, isSustained);
    audioNote.connectSource(audioNote.getGainNode(), destination);
    audioNote.play(contextTimes.start);
    audioNote.endAt(isSustained ? contextTimes.sustainOff : contextTimes.end, isSustained);
    return audioNote;
};
exports.createCompleteAudioNote = createCompleteAudioNote;
function getContextTimesForNote(context, note, currentSongTime, playbackSpeed, isPlayAlong) {
    var delayUntilNote = (note.timestamp / 1000 - currentSongTime) / playbackSpeed;
    var delayCorrection = 0;
    if (isPlayAlong) {
        delayCorrection = getPlayalongDelayCorrection(delayUntilNote);
        delayUntilNote = Math.max(0, delayUntilNote);
    }
    var start = context.currentTime + delayUntilNote;
    var end = start + note.duration / 1000 / playbackSpeed + delayCorrection;
    var sustainOff = start + note.sustainDuration / 1000 / playbackSpeed;
    return { start: start, end: end, sustainOff: sustainOff };
}
function getPlayalongDelayCorrection(delayUntilNote) {
    var delayCorrection = 0;
    if (delayUntilNote < 0) {
        console.log('negative delay');
        delayCorrection = -1 * (delayUntilNote - 0.1);
        delayUntilNote = 0.1;
    }
    return delayCorrection;
}
function getNoteGain(note, volume) {
    var gain = 2 * (note.velocity / 127) * volume;
    var clampedGain = Math.min(10.0, Math.max(-1.0, gain));
    return clampedGain;
}
