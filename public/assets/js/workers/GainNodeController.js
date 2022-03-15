"use strict";
// import { getSetting } from '../settings/Settings.js';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompleteGainNode = exports.createContinuousGainNode = void 0;
var TIME_CONST = 0.05;
var GainNodeController = /** @class */ (function () {
    function GainNodeController(context) {
        // this.createGainNode(context);
        // createGainNote 호출하는 대신 대신 바로 초기화
        this.gainNode = context.createGain();
        // this.gainNode.value = 0;
        this.gainNode.gain.setTargetAtTime(0, 0, TIME_CONST);
        this.sustainValue = -1;
        this.endOfDecayTime = -1;
    }
    //   createGainNode(context: AudioContext) {
    //     this.gainNode = context.createGain();
    //     this.gainNode.value = 0;
    //     this.gainNode.gain.setTargetAtTime(0, 0, TIME_CONST);
    //   }
    GainNodeController.prototype.setAttackAndDecay = function (start, gainValue, adsrValues) {
        var endOfAttackTime = start + adsrValues.attack;
        this.sustainValue = gainValue * adsrValues.sustain;
        this.endOfDecayTime = endOfAttackTime + adsrValues.decay;
        // TODO: 모든 linearRampToValueAtTime 의 3번째 인자를 없앰.
        //Start at 0
        this.gainNode.gain.linearRampToValueAtTime(0, start);
        //Attack
        this.gainNode.gain.linearRampToValueAtTime(gainValue, endOfAttackTime);
        //Decay
        this.gainNode.gain.linearRampToValueAtTime(this.sustainValue, this.endOfDecayTime);
    };
    GainNodeController.prototype.setReleaseGainNode = function (end, release) {
        this.gainNode.gain.linearRampToValueAtTime(this.sustainValue, end);
        //Release
        this.gainNode.gain.linearRampToValueAtTime(0.001, end + release);
        this.gainNode.gain.linearRampToValueAtTime(0, end + release + 0.001);
        this.gainNode.gain.setTargetAtTime(0, end + release + 0.005, TIME_CONST);
    };
    GainNodeController.prototype.endAt = function (endTime, isSustained) {
        // const release = isSustained ? parseFloat(getSetting('adsrReleasePedal')) : parseFloat(getSetting('adsrReleaseKey'));
        var release = isSustained ? 0.35 : 0.35;
        endTime = Math.max(endTime, this.endOfDecayTime);
        if (!isFinite(endTime)) {
            console.error('Note end time : ' + endTime + ' is not finite.');
            endTime = 0;
        }
        this.setReleaseGainNode(endTime, release);
        return endTime;
    };
    return GainNodeController;
}());
exports.default = GainNodeController;
function getAdsrValues() {
    //   let attack = parseFloat(getSetting('adsrAttack'));
    var attack = 0;
    //   const decay = parseFloat(getSetting('adsrDecay'));
    var decay = 0;
    //   const sustain = parseFloat(getSetting('adsrSustain')) / 100;
    var sustain = 100 / 100;
    //   const releasePedal = parseFloat(getSetting('adsrReleasePedal'));
    var releasePedal = 0.35;
    //   const releaseKey = parseFloat(getSetting('adsrReleaseKey'));
    var releaseKey = 0.35;
    return { attack: attack, decay: decay, sustain: sustain, releasePedal: releasePedal, releaseKey: releaseKey };
}
function getAdsrAdjustedForDuration(duration) {
    var maxGainLevel = 1;
    var adsrValues = getAdsrValues();
    //If duration is smaller than decay and attack, shorten decay / set it to 0
    if (duration < adsrValues.attack + adsrValues.decay) {
        adsrValues.decay = Math.max(duration - adsrValues.attack, 0);
    }
    //if attack alone is longer than duration, linearly lower the maximum gain value that will be reached before
    //the sound starts to release.
    if (duration < adsrValues.attack) {
        var ratio = duration / adsrValues.attack;
        maxGainLevel *= ratio;
        adsrValues.attack *= ratio;
        adsrValues.decay = 0;
        adsrValues.sustain = 1;
    }
    adsrValues.maxGainLevel = maxGainLevel;
    return adsrValues;
}
var createContinuousGainNode = function (context, start, gainValue) {
    var gainNodeGen = new GainNodeController(context);
    gainNodeGen.setAttackAndDecay(start, gainValue, getAdsrValues());
    return gainNodeGen;
};
exports.createContinuousGainNode = createContinuousGainNode;
var createCompleteGainNode = function (context, gainValue, ctxTimes, isSustained) {
    var gainNodeGen = new GainNodeController(context);
    var adsrValues = getAdsrAdjustedForDuration((isSustained ? ctxTimes.sustainOff : ctxTimes.end) - ctxTimes.start);
    //Adjust gain value if attack period is longer than duration of entire note.
    gainValue *= adsrValues.maxGainLevel;
    gainNodeGen.setAttackAndDecay(ctxTimes.start, gainValue, adsrValues);
    return gainNodeGen;
};
exports.createCompleteGainNode = createCompleteGainNode;
