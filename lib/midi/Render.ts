import isBlack from '@utils/isBlack';
import CONST from './CONST';
import { getKeyPositionX } from './keyParams';
import Player from './Player';
import { ActiveTrack, MidiChannelSongNoteEvent, MidiChannelSongNoteEventWithIsOn } from './Song';
import { getTrackColor, isTrackDrawn } from './Tracks';

export interface RenderInfoByTrackMap {
  [trackIndex: number]: RenderInfo<ActiveTrack['notesBySeconds']>;
}

export interface RenderInfo<T = ActiveTrack['notesBySeconds']> {
  black: NoteRenderInfo[];
  white: NoteRenderInfo[];
}

export interface NoteRenderInfo {
  noteNumber: number;
  timestamp: number;
  offTime: number;
  duration: number;
  instrument: string;
  track: number;
  channel: number;
  velocity: number;
  noteId: number;
  fillStyle: string;
  currentTime: number;
  isBlack: boolean;
  noteDims: NoteDims;
  isOn: boolean;
  noteDoneRatio: number;
  // rad: number;
  x: number;
  y: number;
  // w: number;
  h: number;
  // sustainH: number;
  // sustainY: number;
}

export interface NoteDims {
  x: number;
  y: number;
  // w: number;
  h: number;
  // sustainH: number;
  // sustainY: number;
  isBlack: boolean;
}

export const whiteKeyWidth = 0.023;
export const blackKeyWidth = 0.014;
export const wholeKeyWidth = 0.024 * 88;
export const whiteKeyHeight = 1;
export const noteToHeightConst = 5;

export function getRenderInfoByTrackMap(playerState: ReturnType<Player['getState']>) {
  const renderInfoByTrackMap: RenderInfoByTrackMap = {};

  if (playerState.song)
    if (playerState.song) {
      playerState.song.activeTracks.forEach((track, trackIndex) => {
        if (isTrackDrawn(trackIndex)) {
          const notesDrawn = new Set();
          renderInfoByTrackMap[trackIndex] = { black: [], white: [] };

          //   const time = this.getRenderTime(playerState);
          const time = getRenderTime(playerState);

          // 처음 값은 -10
          //   const firstSecondShown = Math.floor(
          //     time - this.renderDimensions.getSecondsDisplayedAfter() - CONST.LOOKBACKTIME,
          //   );
          const firstSecondShown = Math.floor(time - getSecondsDisplayedAfter() - CONST.LOOKBACKTIME);

          // 처음 값은 -2
          //   let lastSecondShown = Math.ceil(time + this.renderDimensions.getSecondsDisplayedBefore());
          const lastSecondShown = Math.ceil(time + getSecondsDisplayedBefore());

          for (let i = firstSecondShown; i < lastSecondShown; i++) {
            if (track.notesBySeconds[i]) {
              track.notesBySeconds[i]
                // .filter(note => note.instrument != "percussion")
                .map((note) => {
                  notesDrawn.add(note);
                  //   return this.getNoteRenderInfo(note, time);
                  return getNoteRenderInfo<MidiChannelSongNoteEventWithIsOn>(note, time);
                })
                .forEach((renderInfo) =>
                  renderInfo.isBlack
                    ? renderInfoByTrackMap[trackIndex].black.push(renderInfo)
                    : renderInfoByTrackMap[trackIndex].white.push(renderInfo),
                );
            }
          }
          playerState.longNotes[trackIndex]
            .filter((note) => !notesDrawn.has(note))
            .filter((note) => !(note.offTime < firstSecondShown * 1000) && note.timestamp < firstSecondShown * 1000)
            .map((note) => getNoteRenderInfo<MidiChannelSongNoteEvent>(note, time))
            // .map((note) => {
            //   return note;
            // })
            .forEach((renderInfo) =>
              renderInfo.isBlack
                ? renderInfoByTrackMap[trackIndex].black.push(renderInfo)
                : renderInfoByTrackMap[trackIndex].white.push(renderInfo),
            );
        }
      });
    }

  return renderInfoByTrackMap;
}

export function getNoteRenderInfo<T extends MidiChannelSongNoteEventWithIsOn | MidiChannelSongNoteEvent>(
  note: T,
  time: number,
): NoteRenderInfo {
  time *= 1000;
  const noteDims = getNoteDimensions(note.noteNumber, time, note.timestamp, note.offTime, note.sustainOffTime);

  //overwrite isOn for input notes. As they are continuous and would otherwise always appear to be already played
  //   const isOn = note.isOn ? note.isOn : note.timestamp < time && note.offTime > time ? 1 : 0;
  const isOn = !!(note as MidiChannelSongNoteEventWithIsOn).isOn || (note.timestamp < time && note.offTime > time);
  // 노트가 연주된 시간
  const elapsedTime = Math.max(0, time - note.timestamp);
  // 노트가 연주된 비율
  const noteDoneRatio = elapsedTime / note.duration;

  const isKeyBlack = isBlack(note.noteNumber);

  // TODO: Clean up. Right now it returns more info than necessary to use in DebugRender..
  return {
    noteNumber: note.noteNumber,
    timestamp: note.timestamp,
    offTime: note.offTime,
    duration: note.duration,
    instrument: note.instrument,
    track: note.track,
    channel: note.channel,
    velocity: note.velocity,
    noteId: note.id,
    // TODO: material color로 fillStyle를 대체할 수 있으면 대체하기
    // @ts-ignore
    fillStyle: note.fillStyle
      ? // @ts-ignore
        note.fillStyle
      : isKeyBlack
      ? getTrackColor(note.track).black
      : getTrackColor(note.track).white,
    currentTime: time,
    isBlack: isKeyBlack,
    noteDims: noteDims,
    isOn: isOn,
    noteDoneRatio: noteDoneRatio,
    x: noteDims.x,
    y: noteDims.y,
    // w: noteDims.w,
    h: noteDims.h,
    // sustainH: noteDims.sustainH,
    // sustainY: noteDims.sustainY,
  };
}

export function getRenderTime(playerState: ReturnType<Player['getState']>) {
  //   return playerState.time + getSetting('renderOffset') / 1000;
  return playerState.time + 0 / 1000;
}

export function getSecondsDisplayedBefore() {
  //   const pianoPos = this._pianoPosition / 100;
  const pianoPos = 0 / 100;
  //   return Math.ceil(((1 - pianoPos) * this.getNoteToHeightConst()) / 1000);
  return Math.ceil(((1 - pianoPos) * noteToHeightConst) / 1000);
}

export function getSecondsDisplayedAfter() {
  return Math.ceil(getMilisecondsDisplayedAfter() / 1000);
}

export function getMilisecondsDisplayedAfter() {
  //   const pianoPos = this._pianoPosition / 100;
  const pianoPos = 0 / 100;
  //   return pianoPos * (this.getNoteToHeightConst() / this._playedNoteFalloffSpeed);
  return pianoPos * (noteToHeightConst / 1);
}

export function getNoteDimensions(
  noteNumber: number,
  currentTime: number,
  noteStartTime: number,
  noteEndTime: number,
  sustainOffTime: number,
) {
  const dur = noteEndTime - noteStartTime;
  const isKeyBlack = isBlack(noteNumber);
  let x = getKeyPositionX(noteNumber);
  // let x = getKeyX(noteNumber);
  // const w = isKeyBlack ? blackKeyWidth : whiteKeyWidth;
  //   let h = (dur / this.getNoteToHeightConst()) * (this.windowHeight - this.whiteKeyHeight);
  const planeHeight = 0.6;
  let h = (dur / noteToHeightConst) * planeHeight * 0.001;

  //Correct h if note too short
  let hCorrection = 0;

  // let minNoteHeight = parseFloat(this._minNoteHeight);
  // 1cm
  // const minNoteHeight = 10;

  // TODO: 잠시 주석처리
  // const minNoteHeight = 0.01;
  // if (h < minNoteHeight + 0.02) {
  //   hCorrection = minNoteHeight + 0.02 - h;
  //   h = minNoteHeight + 0.02;
  // }

  //correct rad if h too low
  //   let rad = (this._noteBorderRadius / 100) * w;
  // let rad = 0;
  // if (h < rad * 2) {
  //   rad = h / 2;
  // }

  // time에 맞는 y에서 전체 노트 컨테이너 높이의 반을 뺀다.
  // let y = getYForTime(noteEndTime - currentTime) - planeHeight / 2;
  console.log({ key: CONST.MIDI_NOTE_TO_KEY[noteNumber + 21], currentTime, noteStartTime, noteEndTime });
  let y = getYForTime(noteEndTime - currentTime) - planeHeight / 2;
  // console.log({ y });
  //   let reversed = this._reverseNoteDirection;
  //   if (reversed) {
  //     y -= h;
  //   }
  let reversed = false;

  // TODO: sustain 표시할거면 주석 해제
  // let sustainY = 0;
  // let sustainH = 0;
  // if (sustainOffTime > noteEndTime) {
  // sustainH = ((sustainOffTime - noteEndTime) / this.getNoteToHeightConst()) * (this.windowHeight - whiteKeyHeight);
  // sustainY = this.getYForTime(sustainOffTime - currentTime);
  //   if (reversed) {
  //     sustainY -= sustainH;
  //   }
  // }

  //adjust height/y for notes that have passed the piano / have been played
  //   let showSustainedNotes = this._showSustainedNotes;
  // const showSustainedNotes = false;
  // TODO: Sustain이 없으므로 사용하지 않음
  // const endTime = showSustainedNotes ? Math.max(isNaN(sustainOffTime) ? 0 : sustainOffTime, noteEndTime) : noteEndTime;
  // const endTime = noteEndTime;

  // if (showSustainedNotes) {
  //   if (!isNaN(sustainOffTime) && sustainOffTime < currentTime) {
  //     sustainY += (reversed ? -1 : 1) * whiteKeyHeight;
  //   }
  //   if (!isNaN(sustainOffTime) && sustainOffTime > currentTime && noteEndTime < currentTime) {
  //     sustainH += whiteKeyHeight;
  //     if (reversed) {
  //       sustainY -= whiteKeyHeight;
  //     }
  //   }
  // }

  // TODO: 연주된 노트 축소 비율인데, 연주된 노트는 없앨거라 필요없음
  // if (endTime < currentTime) {
  //   let endRatio = (currentTime - endTime) / getMilisecondsDisplayedAfter();
  //   // endRatio = Math.max(0, 1 - this._noteEndedShrink * endRatio);
  //   endRatio = 0;

  //   x = x + (w - w * endRatio) / 2;
  //   w *= endRatio;

  //   const tmpH = h;
  //   h *= endRatio;
  //   y += (reversed ? -1 : 1) * (tmpH - h);

  //   const tmpSustainH = sustainH;
  //   sustainH *= endRatio;
  //   sustainY += (reversed ? -1 : 1) * (tmpSustainH - sustainH) + (reversed ? -1 : 1) * (tmpH - h);
  // }

  // if (w < 5) {
  //   let diff = 5 - w;
  //   w = 5;
  //   x -= diff / 2;
  // }

  const result = {
    x,
    y,
    h,
    // y: y + (reversed ? hCorrection : -hCorrection),
    // w: w - 0.02,
    // sustainH: sustainH,
    // sustainY: sustainY,
    isBlack: isKeyBlack,
  };

  return result;
}

/**
 * Returns the "white key index" of the note number. Ignores if the key itself is black
 * 백건의 noteNumber을 받았을 때, 그 백건이 몇 번째 백건인지 index를 반환함
 */
export function getWhiteKeyNumber(noteNumber: number) {
  return (
    noteNumber -
    Math.floor(Math.max(0, noteNumber + 11) / 12) -
    Math.floor(Math.max(0, noteNumber + 8) / 12) -
    Math.floor(Math.max(0, noteNumber + 6) / 12) -
    Math.floor(Math.max(0, noteNumber + 3) / 12) -
    Math.floor(Math.max(0, noteNumber + 1) / 12)
  );
}

/**
 * Returns x-value  of the given Notenumber
 * 주어진 Notenumber의 건반 x 좌표를 반환함
 */
export function getKeyX(noteNumber: number) {
  return (
    // (getWhiteKeyNumber(noteNumber) - getWhiteKeyNumber(this.minNoteNumber)) * this.whiteKeyWidth +
    // (this.whiteKeyWidth - this.blackKeyWidth / 2) * (isBlack(noteNumber) ? 1 : 0)
    (getWhiteKeyNumber(noteNumber) - getWhiteKeyNumber(0)) * whiteKeyWidth +
    (whiteKeyWidth - blackKeyWidth / 2) * (isBlack(noteNumber) ? 1 : 0)
  );
}

/**
 * Returns y value corresponding to the given time
 * time에 맞는 노트의 Y 값을 반환함
 */
export function getYForTime(time: number) {
  const height = 0.6;
  //   let noteToHeightConst = this.getNoteToHeightConst();
  // time /= 1000;
  // TODO: getAbsolutePianoPosition 함수는 피아노의 Y 위치를 찾는 듯. 임의로 0.1 설정
  // return -(time / noteToHeightConst) * height + getAbsolutePianoPosition();
  const result = (time / noteToHeightConst) * height * 0.001;
  console.log({ time, result });
  return result;
  // return -(time / noteToHeightConst) * height + 0.1;
}

export function getActiveNotesByTrackMap(renderInfoByTrackMap: RenderInfoByTrackMap) {
  return Object.keys(renderInfoByTrackMap).map((trackIndex) =>
    getActiveNotes(renderInfoByTrackMap[parseInt(trackIndex)].black, renderInfoByTrackMap[parseInt(trackIndex)].white),
  );
}

export function getActiveNotes<T extends RenderInfoByTrackMap[keyof RenderInfoByTrackMap]>(
  notesRenderInfoBlack: T['black'],
  notesRenderInfoWhite: T['white'],
) {
  const activeNotesBlack = notesRenderInfoBlack.filter((renderInfo) => renderInfo.isOn);
  const activeNotesWhite = notesRenderInfoWhite.filter((renderInfo) => renderInfo.isOn);

  return { white: activeNotesWhite, black: activeNotesBlack };
}
