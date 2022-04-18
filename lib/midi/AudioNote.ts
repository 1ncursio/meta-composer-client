// import { getSetting } from '../settings/Settings.js';
import GainNodeController, { createCompleteGainNode, createContinuousGainNode } from './GainNodeController';
import { MidiChannelSongNoteEvent } from './Song';

export interface ContextTimes {
  start: number;
  end: number;
  sustainOff: number;
}

export default class AudioNote {
  source: AudioBufferSourceNode;
  deleteAt: number;
  gainNodeController: GainNodeController | null;

  constructor(context: AudioContext, buffer: AudioBuffer) {
    this.source = context.createBufferSource();
    this.source.buffer = buffer;
    // createContinuousAudioNote, createCompleteAudioNote 에서 넣어주므로 여기서는 안넣어줌.
    // 생성할 때 무조건 넣어주므로, 없어서 에러나는 일은 없음.
    this.gainNodeController = null;
    this.deleteAt = 0;
  }

  connectSource(gainNode: AudioNode, destination: AudioNode) {
    this.source.connect(gainNode);
    this.getGainNode()?.connect(destination);
  }

  getGainNode() {
    return this.gainNodeController?.gainNode;
  }

  suspend() {
    this.source.stop(0);
  }

  play(time: number) {
    this.source.start(time);
  }

  endAt(time: number, isSustained: boolean) {
    // TODO: ?? time 부분에서 에러나면 수정해야 함
    const endTime = this.gainNodeController?.endAt(time, isSustained) ?? time;
    this.endSourceAt(endTime + 0.5);
  }

  endSourceAt(time: number) {
    this.source.stop(time + 10);
    this.deleteAt = time + 12;
  }
}

export const createContinuousAudioNote = (
  context: AudioContext,
  buffer: AudioBuffer,
  volume: number,
  destination: AudioNode,
) => {
  const audioNote = new AudioNote(context, buffer);

  audioNote.gainNodeController = createContinuousGainNode(context, context.currentTime, volume);

  audioNote.connectSource(audioNote.gainNodeController.gainNode, destination);
  audioNote.play(context.currentTime);
  return audioNote;
};

export const createCompleteAudioNote = (
  note: MidiChannelSongNoteEvent,
  currentSongTime: number,
  playbackSpeed: number,
  volume: number,
  isPlayalong: boolean,
  context: AudioContext,
  buffer: AudioBuffer,
  destination: AudioNode,
) => {
  const audioNote = new AudioNote(context, buffer);
  const gainValue = getNoteGain(note, volume);
  if (gainValue == 0) {
    return audioNote;
  }

  const contextTimes = getContextTimesForNote(context, note, currentSongTime, playbackSpeed, isPlayalong);
  const isSustained = true && contextTimes.end < contextTimes.sustainOff;
  // const isSustained = getSetting('sustainEnabled') && contextTimes.end < contextTimes.sustainOff;

  audioNote.gainNodeController = createCompleteGainNode(context, gainValue, contextTimes, isSustained);

  audioNote.connectSource(audioNote.getGainNode()!, destination);

  audioNote.play(contextTimes.start);

  audioNote.endAt(isSustained ? contextTimes.sustainOff : contextTimes.end, isSustained);

  return audioNote;
};

function getContextTimesForNote(
  context: AudioContext,
  note: MidiChannelSongNoteEvent,
  currentSongTime: number,
  playbackSpeed: number,
  isPlayAlong: boolean,
): ContextTimes {
  let delayUntilNote = (note.timestamp / 1000 - currentSongTime) / playbackSpeed;
  let delayCorrection = 0;
  if (isPlayAlong) {
    delayCorrection = getPlayalongDelayCorrection(delayUntilNote);
    delayUntilNote = Math.max(0, delayUntilNote);
  }
  let start = context.currentTime + delayUntilNote;

  let end = start + note.duration / 1000 / playbackSpeed + delayCorrection;

  let sustainOff = start + note.sustainDuration / 1000 / playbackSpeed;
  return { start, end, sustainOff };
}

function getPlayalongDelayCorrection(delayUntilNote: number) {
  let delayCorrection = 0;
  if (delayUntilNote < 0) {
    console.log('negative delay');
    delayCorrection = -1 * (delayUntilNote - 0.1);
    delayUntilNote = 0.1;
  }

  return delayCorrection;
}

function getNoteGain(note: MidiChannelSongNoteEvent, volume: number) {
  let gain = 2 * (note.velocity / 127) * volume;

  let clampedGain = Math.min(10.0, Math.max(-1.0, gain));
  return clampedGain;
}
