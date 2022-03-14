// import { getSetting } from '../settings/Settings.js';

import { ContextTimes } from './AudioNote';

export interface ADSRValues {
  attack: number;
  decay: number;
  sustain: number;
  releasePedal: number;
  releaseKey: number;
  maxGainLevel?: number;
}

const TIME_CONST = 0.05;
export default class GainNodeController {
  gainNode: GainNode;
  sustainValue: number;
  endOfDecayTime: number;

  constructor(context: AudioContext) {
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

  setAttackAndDecay(start: number, gainValue: number, adsrValues: ADSRValues) {
    const endOfAttackTime = start + adsrValues.attack;

    this.sustainValue = gainValue * adsrValues.sustain;
    this.endOfDecayTime = endOfAttackTime + adsrValues.decay;

    // TODO: 모든 linearRampToValueAtTime 의 3번째 인자를 없앰.
    //Start at 0
    this.gainNode.gain.linearRampToValueAtTime(0, start);

    //Attack
    this.gainNode.gain.linearRampToValueAtTime(gainValue, endOfAttackTime);
    //Decay
    this.gainNode.gain.linearRampToValueAtTime(this.sustainValue, this.endOfDecayTime);
  }

  setReleaseGainNode(end: number, release: number) {
    this.gainNode.gain.linearRampToValueAtTime(this.sustainValue, end);
    //Release
    this.gainNode.gain.linearRampToValueAtTime(0.001, end + release);
    this.gainNode.gain.linearRampToValueAtTime(0, end + release + 0.001);
    this.gainNode.gain.setTargetAtTime(0, end + release + 0.005, TIME_CONST);
  }

  endAt(endTime: number, isSustained: boolean) {
    // const release = isSustained ? parseFloat(getSetting('adsrReleasePedal')) : parseFloat(getSetting('adsrReleaseKey'));
    const release = isSustained ? 0.35 : 0.35;
    endTime = Math.max(endTime, this.endOfDecayTime);
    if (!isFinite(endTime)) {
      console.error('Note end time : ' + endTime + ' is not finite.');
      endTime = 0;
    }
    this.setReleaseGainNode(endTime, release);
    return endTime;
  }
}

function getAdsrValues(): ADSRValues {
  //   let attack = parseFloat(getSetting('adsrAttack'));
  const attack = 0;
  //   const decay = parseFloat(getSetting('adsrDecay'));
  const decay = 0;
  //   const sustain = parseFloat(getSetting('adsrSustain')) / 100;
  const sustain = 100 / 100;
  //   const releasePedal = parseFloat(getSetting('adsrReleasePedal'));
  const releasePedal = 0.35;
  //   const releaseKey = parseFloat(getSetting('adsrReleaseKey'));
  const releaseKey = 0.35;

  return { attack, decay, sustain, releasePedal, releaseKey };
}

function getAdsrAdjustedForDuration(duration: number) {
  let maxGainLevel = 1;
  let adsrValues = getAdsrValues();
  //If duration is smaller than decay and attack, shorten decay / set it to 0
  if (duration < adsrValues.attack + adsrValues.decay) {
    adsrValues.decay = Math.max(duration - adsrValues.attack, 0);
  }
  //if attack alone is longer than duration, linearly lower the maximum gain value that will be reached before
  //the sound starts to release.
  if (duration < adsrValues.attack) {
    let ratio = duration / adsrValues.attack;
    maxGainLevel *= ratio;
    adsrValues.attack *= ratio;
    adsrValues.decay = 0;
    adsrValues.sustain = 1;
  }
  adsrValues.maxGainLevel = maxGainLevel;
  return adsrValues;
}

export const createContinuousGainNode = (context: AudioContext, start: number, gainValue: number) => {
  const gainNodeGen = new GainNodeController(context);

  gainNodeGen.setAttackAndDecay(start, gainValue, getAdsrValues());
  return gainNodeGen;
};

export const createCompleteGainNode = (
  context: AudioContext,
  gainValue: number,
  ctxTimes: ContextTimes,
  isSustained: boolean,
) => {
  const gainNodeGen = new GainNodeController(context);

  const adsrValues = getAdsrAdjustedForDuration((isSustained ? ctxTimes.sustainOff : ctxTimes.end) - ctxTimes.start);

  //Adjust gain value if attack period is longer than duration of entire note.
  gainValue *= adsrValues.maxGainLevel!;

  gainNodeGen.setAttackAndDecay(ctxTimes.start, gainValue, adsrValues);

  return gainNodeGen;
};
