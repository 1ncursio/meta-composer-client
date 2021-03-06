// @ts-nocheck

import CONST from '@lib/midi/CONST';
import { ActiveTrack, MidiChannelSongNoteEventWithIsOn, NotesBySeconds } from '@lib/midi/Song';
import { MidiMetaKeySignatureEvent } from '@typings/MidiEvent';
import sumArray from '@utils/sumArray';
import Vex from 'vexflow';
import Measure from './Measure';
import RoundedNote from './RoundedNote';

export interface MeasureWithRoundedNotesMap {
  [measureIndex: string]: {
    [trackIndex: string]: RoundedNotesByQuantizedTimestamp;
  };
}

export interface RoundedNotesByQuantizedTimestamp {
  [quantizedTimestamp: string]: RoundedNote[];
}

export interface NewLinesDivs {
  [keySignatureName: string]: {
    bass: HTMLCanvasElement;
    treble: HTMLCanvasElement;
  };
}

export interface MeasuresBySecond {
  [key: string]: IMeasure;
}

export interface YBounds {
  [key: string]: {
    min: number;
    max: number;
  };
}

export type QuantizeFunction = (num: number) => number;

export type IMeasure = [number, number];

const noteDenoms: number[] = [];
for (let i = -8; i < 8; i++) {
  noteDenoms.push(Math.pow(2, i));
}

const BAR_HEIGHT = 170;
const MIN_MEASURE_WIDTH = 250;
const STAFF_WIDTH = 140;

const SHEET_SIDE_MARGIN = 55;

export default class SheetGenerator {
  keySignature: MidiMetaKeySignatureEvent;
  keySignatureName: string;
  songEnd: number;
  VF: typeof Vex.Flow;
  formatter: Vex.Flow.Formatter;
  measureWithRoundedNotesMap: MeasureWithRoundedNotesMap;
  numerator: number;
  denominator: number;
  measures: IMeasure[];
  cumulativeXPosition: number;
  measureObjects: Measure[];
  lineStartIndexes: number[];
  newLinesDivs: NewLinesDivs;
  generated: boolean;
  inputStave: Vex.Flow.Stave;
  yBounds: YBounds;
  scale: string;
  // staffYs: {};
  sharpsFlat: string;
  sharpsFlatSymbol: string;
  key: number;

  constructor(
    measuresBySecond: MeasuresBySecond,
    numerator: number,
    denominator: number,
    keySignature: MidiMetaKeySignatureEvent,
    songEnd: number,
  ) {
    this.keySignature = keySignature;
    // TODO: ==에서 ===에서 바꿨음. 문제 생기면 다시 바꿔야함.
    this.keySignature.scale = keySignature.scale === 0 ? 'MAJOR' : 'MINOR';
    this.scale = this.keySignature.scale;

    this.keySignature.key = keySignature.key;
    this.key = this.keySignature.key;

    // TODO: this.key를 할당하는 곳이 존재하지 않음. 디버깅 후에도 undefined로 나옴. this.keySignature.key 로 변경.
    this.keySignature.sharpsFlat = this.keySignature.key > 0 ? 'SHARPS' : 'FLATS';
    this.sharpsFlat = this.keySignature.sharpsFlat;

    this.keySignature.sharpsFlatSymbol = this.keySignature.sharpsFlat === 'SHARPS' ? '#' : 'b';
    this.sharpsFlatSymbol = this.keySignature.sharpsFlatSymbol;

    // @ts-ignore
    this.keySignatureName = CONST.MIDI_TO_VEXFLOW_KEYS[this.keySignature.scale][this.keySignature.key];
    this.songEnd = songEnd;

    this.generated = false;
    this.VF = Vex.Flow;
    this.formatter = new Vex.Flow.Formatter({
      /* globalSoftmax: false*/
    });

    this.measureWithRoundedNotesMap = {};
    this.numerator = numerator;
    this.denominator = denominator;
    this.measures = flattenMeasures(measuresBySecond, songEnd);
    this.cumulativeXPosition = 0;

    this.measureObjects = [];

    this.lineStartIndexes = [];
    this.newLinesDivs = {};
    this.yBounds = {};
    this.getNewLineDiv(this.keySignatureName);

    // TODO: 스크롤 구현 시 사용
    // this.sheetMeasureScrollCallback = () => {
    //   if (getSetting('sheetMeasureScroll')) {
    //     this.computeLines(Infinity, 0);
    //   } else {
    //     this.computeLines(window.innerWidth, SHEET_SIDE_MARGIN);
    //   }
    // };

    // setSettingCallback('sheetMeasureScroll', this.sheetMeasureScrollCallback);
  }
  clear() {
    this.measureWithRoundedNotesMap = {};
    // TODO: 오류 생기면 null로 변경
    // this.numerator = null;
    // this.denominator = null;
    this.numerator = 0;
    this.denominator = 0;
    this.measures = [];
    this.cumulativeXPosition = 0;
    // removeSettingCallback('sheetMeasureScroll', this.sheetMeasureScrollCallback);

    this.measureObjects.forEach((measure) => {
      for (const key in measure) {
        measure[key] = null;
      }
      // @ts-ignore
      delete this.measureObjects[measure];
    });

    this.lineStartIndexes = [];
    this.newLinesDivs = {};

    // this.sheetMeasureScrollCallback = null;
  }

  async generate(tracks: ActiveTrack[]) {
    this.generateRoundedNotes(tracks);

    this.generateMeasures();

    this.generateCanvases();
    this.generateNotePaths();
    this.generateStaveForInputKey();
    this.computeCumulativeXs();

    // TODO: 스크롤 지원하면 주석 해제
    // if (!getSetting('sheetMeasureScroll')) {
    //   this.computeLines(window.innerWidth, SHEET_SIDE_MARGIN);
    // }
    this.computeLines(window.innerWidth, SHEET_SIDE_MARGIN);

    this.generated = true;
    // TODO: 배열을 Object.keys로 접근했음. 변경해둠
    // Object.keys(this.measureObjects).forEach((key) => {
    //   delete this.measureObjects[key].divs;
    // });
    this.measureObjects.forEach((measure) => {
      delete measure.divs;
    });

    return Promise.resolve();
  }

  getNewLineDiv(keySignatureName: string) {
    if (!this.newLinesDivs.hasOwnProperty(keySignatureName)) {
      this.newLinesDivs[keySignatureName] = {
        treble: this.getRenderedStave('treble'),
        bass: this.getRenderedStave('bass'),
      };
    }
    return this.newLinesDivs[keySignatureName];
  }

  getRenderedStave(clef: string) {
    let div = document.createElement<'canvas'>('canvas');
    div.width = STAFF_WIDTH;
    div.height = BAR_HEIGHT;
    let stave = this.getStave(0, 0, STAFF_WIDTH, clef, true, false);
    let renderer = new this.VF.Renderer(div, this.VF.Renderer.Backends.CANVAS);
    let context = renderer.getContext();
    stave.setContext(context).draw();
    div.style.width = '';
    div.style.height = '';
    document.body.appendChild(div);
    return div;
  }

  computeLines(width: number, margin: number) {
    this.lineStartIndexes = [0];
    let x = SHEET_SIDE_MARGIN;
    let hasKey = true;
    // if (!getSetting('sheetMeasureScroll')) {
    Object.values(this.measureObjects).forEach((measureObj, measureIndex) => {
      x += measureObj.measureWidth;
      if (x > width - margin - STAFF_WIDTH) {
        x = measureObj.measureWidth;
        this.lineStartIndexes.push(measureIndex);
        hasKey = true;
      }
      if (measureObj && measureObj.isFirstInRow != hasKey) {
        // this.redrawMeasureWithKey(measureIndex, hasKey)

        measureObj.isFirstInRow = hasKey;
      }
      hasKey = false;
    });
    // }
    // else {
    //   Object.values(this.measureObjects).forEach((measureObj, measureIndex) => {
    //     measureObj.isFirstInRow = measureIndex == 0;
    //   });
    // }
    this.computeCumulativeXs();
  }

  computeCumulativeXs() {
    let x = 0;
    Object.values(this.measureObjects).forEach((measure) => {
      if (measure.isFirstInRow) {
        x = 0;
      }
      measure.cumulativeXPosition = x;
      x += measure.measureWidth;
    });
  }

  generateRoundedNotes(tracks: ActiveTrack[]) {
    tracks.forEach((track, trackIndex) => {
      let notesBySeconds = track.notesBySeconds;

      let curTime = 0;
      this.measures.forEach((measure, measureIndex) => {
        let measureEnd = measure[0];
        let notesOfMeasure = getNotesInTimewindow(curTime - 5, measureEnd - 5, notesBySeconds);

        let beatDuration = (measureEnd - curTime) / this.numerator;
        let quantizeConstant = beatDuration / 2 ** 5;
        let quantize: QuantizeFunction = (num) => Math.floor(num / quantizeConstant) * quantizeConstant;

        if (!this.measureWithRoundedNotesMap.hasOwnProperty(measureIndex)) {
          this.measureWithRoundedNotesMap[measureIndex] = {};
        }
        let roundedNotesOfMeasure = this.getRoundedNotesOfMeasure(notesOfMeasure, quantize, beatDuration, trackIndex);
        let groupedNotes = this.getGroupedNotes(roundedNotesOfMeasure, quantize);
        this.measureWithRoundedNotesMap[measureIndex][trackIndex] = groupedNotes;

        let stepThroughTime = curTime;
        let currentMeasureNotes = this.measureWithRoundedNotesMap[measureIndex][trackIndex];
        stepThroughTime = this.stepThroughMeasureAndFillRestsInbetweenNotes(
          currentMeasureNotes,
          stepThroughTime,
          beatDuration,
          quantize,
          trackIndex,
        );
        this.stepTillEndOfMeasureAndFillRests(
          measure,
          stepThroughTime,
          beatDuration,
          quantize,
          currentMeasureNotes,
          trackIndex,
        );
        curTime = measureEnd;
        stepThroughTime = curTime;
      });
    });
  }

  generateStaveForInputKey() {
    this.inputStave = new Vex.Flow.Stave(0, 0, 100).setKeySignature(this.keySignatureName, this.keySignatureName);
  }

  getLineForKey(key: string, clef: string) {
    let inputNote = new Vex.Flow.StaveNote({
      clef: clef || 'treble',
      keys: [key],
      duration: '1/2',
    });
    new Vex.Flow.Formatter().formatToStave([this.getVoicesOfTrack(Vex.Flow, [inputNote])], this.inputStave, {
      align_rests: false,
      // TODO: context 추가해야 함.
      // context:
    });

    // TODO: 구버전에서 신버전으로 바뀜. 동작안하면 변경
    // return inputNote.keyProps[0].line;
    return inputNote.getKeyProps()[0].line;
  }

  stepTillEndOfMeasureAndFillRests(
    measure: IMeasure,
    stepThroughTime: number,
    beatDuration: number,
    quantize: QuantizeFunction,
    currentMeasureNotes: RoundedNotesByQuantizedTimestamp,
    trackIndex: number,
  ) {
    let measureEnd = measure[0];
    let timeTilMeasureEnd = Math.max(0, measureEnd - stepThroughTime);
    if (timeTilMeasureEnd > beatDuration / 32) {
      let bestDurationFitDenom = this.getBestNoteDurationFit(
        quantize(timeTilMeasureEnd),
        beatDuration,
        this.denominator,
      );
      let restNote = new RoundedNote(
        {
          timestamp: stepThroughTime,
          duration: quantize(timeTilMeasureEnd),
          midiNoteNumber: 71,
        },
        this.numerator,
        bestDurationFitDenom.denom,
        bestDurationFitDenom.dotted,
        true,
        trackIndex,
      );
      currentMeasureNotes[Math.floor(stepThroughTime)] = [restNote];
    }
  }

  stepThroughMeasureAndFillRestsInbetweenNotes(
    currentMeasureNotes: RoundedNotesByQuantizedTimestamp,
    stepThroughTime: number,
    beatDuration: number,
    quantize: QuantizeFunction,
    trackIndex: number,
  ) {
    Object.values(currentMeasureNotes).forEach((roundedNotes) => {
      let roundedNote = roundedNotes.sort((a, b) => b.note.duration - a.note.duration)[0];
      let timeUntilNext = Math.max(0, roundedNote.note.timestamp - stepThroughTime);

      if (timeUntilNext > beatDuration / 32) {
        // TODO: 인자 2개만 받는데 4개 보내는 중
        let bestDurationFitDenom = this.getBestNoteDurationFit(
          quantize(timeUntilNext),
          beatDuration,
          // @ts-ignore
          this.denominator,
          true,
        );
        let restNote = new RoundedNote(
          {
            timestamp: stepThroughTime,
            duration: quantize(timeUntilNext),
            midiNoteNumber: 71,
          },
          this.numerator,
          bestDurationFitDenom.denom,
          bestDurationFitDenom.dotted,
          true,
          trackIndex,
        );
        currentMeasureNotes[Math.floor(stepThroughTime)] = [restNote];
      }
      stepThroughTime = Math.max(stepThroughTime, stepThroughTime + timeUntilNext + roundedNote.note.duration);
    });
    return stepThroughTime;
  }

  getRoundedNotesOfMeasure(
    notesOfMeasure: MidiChannelSongNoteEventWithIsOn[],
    quantize: QuantizeFunction,
    beatDuration: number,
    trackIndex: number,
  ) {
    const roundedNotesOfMeasure: RoundedNote[] = [];

    notesOfMeasure.forEach((note) => {
      let quantizedDuration = quantize(note.duration);
      let bestDurationFitDenom = this.getBestNoteDurationFit(quantizedDuration, beatDuration);
      roundedNotesOfMeasure.push(
        new RoundedNote(
          note,
          this.numerator,
          bestDurationFitDenom.denom,
          bestDurationFitDenom.dotted,
          false,
          trackIndex,
        ),
      );
    });
    return roundedNotesOfMeasure;
  }

  generateMeasures() {
    this.yBounds = {};

    let lastIndexInSong = Object.keys(this.measureWithRoundedNotesMap).length - 1;
    Object.keys(this.measureWithRoundedNotesMap).forEach((measureIndex) => {
      let isFirstInRow = this.lineStartIndexes.includes(parseInt(measureIndex));
      let isLastMeasure = lastIndexInSong == measureIndex;
      this.measureObjects.push(this.generateMeasure(parseInt(measureIndex), isFirstInRow, isLastMeasure));
    });
  }

  generateMeasure(measureIndex: number, isFirstInRow: boolean, isLastMeasure: boolean) {
    let VF = this.VF;
    let voicesOfTracks = this.getVoicesOfMeasure(measureIndex);
    let beams = {};
    Object.keys(voicesOfTracks).forEach((track) => {
      let staveNotes = voicesOfTracks[track].tickables;
      let autoBeams = VF.Beam.generateBeams(staveNotes);
      beams[track] = autoBeams;
    });
    if (Object.keys(voicesOfTracks).length) {
      let voicesWithNotes = this.getVoicesWithNotes(voicesOfTracks);
      let hasNotes = Object.keys(voicesWithNotes).length > 0;

      let measureWidth = this.computeMinMeasureWidth(
        hasNotes,
        measureIndex,
        voicesWithNotes,
        MIN_MEASURE_WIDTH,
        isFirstInRow,
      );

      let renderers = {};
      let contexts = {};
      let divs = {};

      this.setupRenderers(voicesOfTracks, divs, measureWidth, renderers, contexts);
      let staves = this.getStaves(voicesOfTracks, measureWidth, isFirstInRow, isLastMeasure);
      console.log('generateMeasure', measureIndex, staves);

      //TODO make leading track configurable.
      let track0 = Object.keys(staves).find((key) => key);

      if (hasNotes) {
        this.formatVoices(voicesWithNotes, measureWidth, track0);

        let maxX = measureWidth;
        Object.values(voicesWithNotes).forEach((voice) => {
          voice.tickables.forEach((tickable) => {
            if (tickable.getTieLeftX && tickable.getTieLeftX() + tickable.width + 20 > maxX) {
              maxX = tickable.getTieLeftX() + tickable.width + 20;
            }
          });
        });
        if (maxX > measureWidth) {
          measureWidth = Math.ceil(maxX + 10);
          Object.values(staves).forEach((staff) => staff.setWidth(measureWidth));
          Object.values(renderers).forEach((renderer) => renderer.resize(measureWidth, BAR_HEIGHT));
        }
        Object.keys(staves).forEach((track) => staves[track].setContext(contexts[track]).draw());

        this.renderVoices(voicesWithNotes, contexts, staves, beams);
      }

      let staveObj = {};
      Object.keys(staves).forEach((key) => {
        let staff = staves[key];
        staveObj[key] = {};
        staveObj[key].clef = staff.clef;
        staveObj[key].space_above_staff_ln = staff.options.space_above_staff_ln;
        staveObj[key].spacing_between_lines_px = staff.options.spacing_between_lines_px;
      });

      let startTsp = measureIndex > 0 ? this.measures[measureIndex - 1][0] : 0;
      let endTsp = this.measures[measureIndex][0];
      let msDuration = endTsp - startTsp;

      let measureObj = new Measure(
        divs,
        staveObj,
        measureWidth,
        this.measureWithRoundedNotesMap[measureIndex],
        startTsp,
        endTsp,
        msDuration,
        this.keySignature,
        this.keySignatureName,
        this.cumulativeXPosition,
        isFirstInRow,
      );

      // this.cumulativeXPosition += measureWidth

      this.setYBoundsOfTrack(voicesOfTracks, beams);
      return measureObj;
    }
  }

  getVoicesWithNotes(voicesOfTracks) {
    let voicesWithNotes = {};
    Object.entries(voicesOfTracks)
      .filter((entry) => entry[1] != null)
      .forEach((entry) => {
        voicesWithNotes[entry[0]] = entry[1];
      });
    return voicesWithNotes;
  }

  renderVoices(voicesWithNotes, contexts, staves, beams) {
    Object.entries(voicesWithNotes).forEach((entry) => {
      let track = entry[0];
      let voice = entry[1];
      voice.draw(contexts[track], staves[track]);
    });
    Object.entries(beams).forEach((entry) => {
      let track = entry[0];
      let autoBeams = entry[1];

      autoBeams.forEach((beam) => beam.setContext(contexts[track]).draw());
    });
  }

  formatVoices(voicesWithNotes, measureWidth: number, track0) {
    Object.values(voicesWithNotes).forEach((voice, index) =>
      this.formatter.format([voice], measureWidth, {
        // this.formatter.formatToStave([voice], staves[track0], {
        align_rests: true,
        // context:context
      }),
    );

    this.formatter.format(
      // this.formatter.formatToStave(
      Object.values(voicesWithNotes),
      measureWidth,
      // staves[track0],
      {
        align_rests: true,
        // context:context
      },
    );
  }

  generateCanvases() {
    for (let measureIndex in this.measureObjects) {
      this.measureObjects[measureIndex].canvases = {};
      this.generateCanvas(measureIndex);
    }
  }

  generateCanvas(measureIndex) {
    Object.entries(this.measureObjects[measureIndex].divs).forEach((measureEntry) => {
      let cnv = document.createElement<'canvas'>('canvas');
      let ctx = cnv.getContext('2d');
      let svg = measureEntry[1].children[0];

      let bounds = this.yBounds[measureEntry[0]];
      let curY = 0 - bounds.min;

      cnv.width = svg.width.baseVal.value;
      cnv.height = svg.height.baseVal.value + curY;

      ctx.translate(0, curY);
      drawRects(svg, ctx);

      svg.querySelectorAll('path').forEach((path) => {
        drawPath(ctx, path);
      });

      this.measureObjects[measureIndex].canvases[measureEntry[0]] = cnv;
    });
  }

  generateNotePaths() {
    for (let measureIndex in this.measureObjects) {
      this.generateNotePathsForMeasure(measureIndex);
    }
  }

  generateNotePathsForMeasure(measureIndex) {
    Object.values(this.measureObjects[measureIndex].roundedNotes).forEach((track) =>
      Object.values(track).forEach((roundedNoteArr) =>
        roundedNoteArr.forEach((roundedNote) => {
          roundedNote.paths = this.getPathsInChildren(roundedNote.staveNote.attrs.el);
          if (roundedNote.staveNote.beam) {
            // <path stroke-width="1.5" fill="none" stroke="black" stroke-dasharray="none" d="M92.06567999999999 60L92.06567999999999 95.83015775"></path>
            let stem = roundedNote.staveNote.stem;
            let stemX = 0;
            let stemY = 0;
            if (stem.stem_direction === -1) {
              stemX = stem.x_begin;
              stemY = stem.y_top;
            } else {
              stemX = stem.x_end;
              stemY = stem.y_bottom;
            }
            let stemHeight = stem.getHeight() - stem.stem_direction * 5 * roundedNote.staveNote.beam.beam_count;
            let stemletYOffset = stem.isStemlet ? stemHeight - stem.stemletHeight * stem.stem_direction : 0;

            let stemPath = document.createElementNS(null, 'path', 'http://www.w3.org/2000/svg');
            stemPath.setAttributeNS(null, 'stroke-width', 1.5);
            stemPath.setAttributeNS(null, 'stroke', 'black');
            stemPath.setAttributeNS(
              null,
              'd',
              'M' +
                stemX +
                ' ' +
                (stemY - stemletYOffset) +
                'L' +
                stemX +
                ' ' +
                (stemY - stemHeight - stem.renderHeightAdjustment * stem.stem_direction),
            );

            roundedNote.paths.push(stemPath);
          }
        }),
      ),
    );
  }

  getPathsInChildren(el: Element) {
    if (!el) {
      return [];
    }
    if (el.tagName == 'path') {
      return [el];
    }

    const paths: SVGPathElement[] = [];
    Array.from(el.children).forEach((child) => {
      if (child.tagName === 'path') {
        paths.push(child as SVGPathElement);
      } else if (child.children) {
        this.getPathsInChildren(child).forEach((pth) => {
          // @ts-ignore
          paths.push(pth);
        });
      }
    });
    return paths;
  }

  getStaves(voicesOfTracks, measureWidth: number, isFirstInRow: boolean, isLastMeasure: boolean) {
    let staves = {};
    Object.keys(voicesOfTracks).forEach((track, index) => {
      let clef = index == 0 ? 'treble' : 'bass';

      staves[track] = this.getStave(0, 0, measureWidth, clef, isFirstInRow, isLastMeasure);
    });
    return staves;
  }

  setupRenderers(voicesOfTracks, divs, measureWidth: number, renderers, contexts) {
    Object.keys(voicesOfTracks).forEach((track) => {
      let VF = this.VF;
      let div = document.createElement<'div'>('div');
      divs[track] = div;
      let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      renderer.resize(measureWidth, BAR_HEIGHT);
      renderers[track] = renderer;
      contexts[track] = renderer.getContext();
      // document.body.appendChild(div)
    });
  }

  computeMinMeasureWidth(
    hasNotes: boolean,
    measureIndex: number,
    voicesWithNotes,
    minMeasureWidth: number,
    isFirstInRow: boolean,
  ) {
    const timestamps: { [timestamp: string]: number } = {};
    let mods = 0;
    Object.keys(this.measureWithRoundedNotesMap[measureIndex]).forEach((track, trackIndex) => {
      if (!this.yBounds.hasOwnProperty(track)) {
        this.yBounds[track] = { min: 0, max: 0 };
      }
      let groupedNotes = this.measureWithRoundedNotesMap[measureIndex][track];
      Object.keys(groupedNotes).forEach((tsp, noteIndex) => {
        if (!timestamps.hasOwnProperty(tsp)) {
          timestamps[tsp] = 1;
          mods += voicesWithNotes[track].tickables[noteIndex].modifiers.length;
        }
      });
    });

    let distinctTspsWidth = Object.keys(timestamps).length * 28 + mods * 25;
    distinctTspsWidth = distinctTspsWidth > 0 ? distinctTspsWidth : minMeasureWidth;

    const measureWidth = hasNotes
      ? Math.max(
          50 + distinctTspsWidth,
          Math.max(minMeasureWidth, this.formatter.preCalculateMinTotalWidth(Object.values(voicesWithNotes))),
        )
      : minMeasureWidth;

    // measureWidth += isFirstInRow ? STAFF_WIDTH : 0
    return measureWidth;
  }

  setYBoundsOfTrack(voicesOfTracks, beams) {
    Object.entries(voicesOfTracks)
      .filter((voiceTrackEntry) => voiceTrackEntry[1] != null)
      .forEach((voiceTrackEntry) => {
        let track = voiceTrackEntry[0];
        let voice = voiceTrackEntry[1];

        let bbox = voice.boundingBox;
        if (bbox != null) {
          if (bbox.y < this.yBounds[track].min) {
            this.yBounds[track].min = bbox.y;
          }
          if (bbox.y + bbox.h > this.yBounds[track].max) {
            this.yBounds[track].max = bbox.y + bbox.h;
          }
        }
      });
    Object.entries(beams).forEach((beamEntry) => {
      let track = beamEntry[0];
      let beamsOfEntry = beamEntry[1];
      if (beamsOfEntry.length) {
        beamsOfEntry.forEach((beam) => {
          if (beam.notes) {
            beam.notes.forEach((note) => {
              let extents = note.stem.getExtents();
              let val = Math.min(extents.topY, extents.baseY);
              if (val < this.yBounds[track].min) {
                this.yBounds[track].min = val;
              }
              if (val > this.yBounds[track].max) {
                this.yBounds[track].max = val;
              }
            });
          }
        });
      }
    });
  }

  getVoicesOfMeasure(measureIndex: number) {
    let VF = this.VF;
    let voicesOfTracks = {};

    Object.keys(this.measureWithRoundedNotesMap[measureIndex]).forEach((track, trackIndex) => {
      if (!this.yBounds.hasOwnProperty(track)) {
        this.yBounds[track] = { min: 0, max: 0 };
      }
      let notesOfMeasure = this.measureWithRoundedNotesMap[measureIndex][track];

      //TODO Detect clef
      let clef = trackIndex == 1 ? 'bass' : 'treble';
      let staveNotes = this.getStaveNotes(notesOfMeasure, clef);

      if (staveNotes.length) {
        voicesOfTracks[track] = this.getVoicesOfTrack(VF, staveNotes);
      } else {
        voicesOfTracks[track] = null;
      }
    });
    return voicesOfTracks;
  }

  getVoicesOfTrack(VF: typeof Vex.Flow, notes: Vex.Flow.Tickable[]) {
    return new VF.Voice({
      num_beats: this.numerator,
      beat_value: this.denominator,
      resolution: Vex.Flow.RESOLUTION,
    })
      .setStrict(false)
      .addTickables(notes);
  }

  getBestNoteDurationFit(duration: number, beatDuration: number) {
    let denominationFits: number[] = [];
    let dottedDenominationFits: number[] = [];
    let minFit = 999999999;
    let minIndex = 0;
    noteDenoms.forEach((denom) => {
      denominationFits.push(Math.abs(duration / beatDuration / this.denominator / denom - 1));
      //take power of dotted fit to weigh them less.
      dottedDenominationFits.push(
        // TODO: 오작동시 수정
        // Math.abs(duration / beatDuration / this.denominator / (denom * 1.5), 2) - 1),
        Math.pow(Math.abs(duration / beatDuration / this.denominator / (denom * 1.5)) - 1, 2),
      );
    });
    let dotted = false;
    denominationFits.forEach((fit, index) => {
      if (fit < minFit) {
        dotted = false;
        minFit = fit;
        minIndex = index;
      }
    });
    dottedDenominationFits.forEach((fit, index) => {
      if (fit < minFit) {
        dotted = true;
        minFit = fit;
        minIndex = index;
      }
    });
    return { denom: noteDenoms[minIndex], dotted: dotted };
  }
  //TODO do multiple passovers
  getBestRestDurationFit(duration: number, beatDuration: number, denominator: number) {
    const denominationFits: number[] = [];
    const dottedDenominationFits: number[] = [];
    let minFit = 999999999;
    let minIndex = 0;
    noteDenoms.forEach((denom) => {
      denominationFits.push(Math.abs(duration / beatDuration / denominator / denom - 1));
      dottedDenominationFits.push(Math.abs(duration / beatDuration / denominator / (denom * 1.5) - 1));
    });
    let dotted = false;
    denominationFits.forEach((fit, index) => {
      if (fit < minFit) {
        dotted = false;
        minFit = fit;
        minIndex = index;
      }
    });
    dottedDenominationFits.forEach((fit, index) => {
      if (fit < minFit) {
        dotted = true;
        minFit = fit;
        minIndex = index;
      }
    });
    return { denom: noteDenoms[minIndex], dotted: dotted };
  }

  getStaveNotes(groupedNotes: RoundedNotesByQuantizedTimestamp, clef: string) {
    const noteAmount = sumArray(Object.values(groupedNotes).map((arr) => arr.length));
    const keyManager = new this.VF.KeyManager(this.keySignatureName);
    return Object.keys(groupedNotes)
      .sort((a, b) => a - b)
      .map((key) => groupedNotes[key])
      .map((roundedNotes) => this.mapGroupedNotesToStaveNote(roundedNotes, clef, noteAmount, keyManager));
  }

  mapGroupedNotesToStaveNote(groupedNotes: RoundedNote[], clef: string, noteAmountInMeasure: number, keyManager) {
    const VF = this.VF;
    let keys = [];
    let accidentals = [];
    let dots = [];

    if (groupedNotes.length > 1) {
      groupedNotes.sort((a, b) => a.note.midiNoteNumber - b.note.midiNoteNumber);
    }

    groupedNotes.forEach((roundedNote, index) => {
      // let { noteChar, noteNum, noteAccidental } = !roundedNote.isRest
      // 	? keyManager.getNoteWithAccidental(
      // 			roundedNote.note.midiNoteNumber,
      // 			false
      // 	  )
      // 	: {
      // 			noteChar: clef == "treble" ? "B" : "D",
      // 			noteNum: clef == "treble" ? 4 : 3,
      // 			noteAccidental: ""
      // 	  }
      // let noteStr =
      // 	noteChar.toUpperCase() +
      // 	(noteAccidental ? noteAccidental : "") +
      // 	"/" +
      // 	noteNum
      const name = CONST.MIDI_NOTE_TO_KEY[roundedNote.note.midiNoteNumber];
      let noteChar = name[0];
      let noteNum = name[name.length - 1];
      if (roundedNote.isRest) {
        noteChar = clef == 'treble' ? 'B' : 'D';
        noteNum = clef == 'treble' ? 4 : 3;
      }
      let spl = name.split('b');
      let noteAccidental = spl.length == 1 ? '' : 'b';

      let noteParts = keyManager.selectNote(noteChar + noteAccidental);
      noteAccidental = noteParts.accidental === null && noteParts.change ? 'n' : noteParts.accidental;
      let noteStr = noteParts.note + '/' + noteNum;
      keys.push(noteStr);
      if (roundedNote.dotted) {
        dots.push(index);
      }
      if (noteAccidental && noteParts.change && !groupedNotes[0].isRest) {
        accidentals.push([index, noteAccidental]);
      }
    });

    let duration = this.getDurationStringOfGroupedNotes(groupedNotes);

    let staveNote: Vex.Flow.GhostNote | Vex.Flow.StaveNote;

    let ghost = false;
    if (groupedNotes[0].isRest && groupedNotes[0].denom <= 1 / CONST.NOTE_DENOMS_NAMES[getSetting('hideRestsBelow')]) {
      ghost = true;
      staveNote = new VF.GhostNote({
        clef: clef,
        keys: keys,
        duration: duration,
        auto_stem: groupedNotes[0].isRest,
      });
    } else {
      staveNote = new VF.StaveNote({
        clef: clef,
        keys: keys,
        duration: duration,
        auto_stem: groupedNotes[0].isRest,
        align_center: groupedNotes[0].isRest && noteAmountInMeasure == 1,
      });
    }

    groupedNotes.forEach((roundedNote) => (roundedNote.staveNote = staveNote));
    if (!ghost) {
      dots.forEach((dot) => {
        staveNote.addDot(dot);
      });
      accidentals.forEach((accidental) => staveNote.addAccidental(accidental[0], new VF.Accidental(accidental[1])));
    }
    return staveNote;
  }

  getDurationStringOfGroupedNotes(roundedNotes) {
    let duration = Math.max.apply(
      null,
      roundedNotes.map((roundedNote) => mapDurationToAlias(roundedNote)),
    );
    duration = duration == 0.5 ? '1/2' : duration == 0.25 ? '1/2' : duration;

    duration += roundedNotes.filter((roundedNote) => roundedNote.dotted).length > 0 ? 'd' : '';

    duration += roundedNotes.length == 1 && roundedNotes[0].isRest ? 'r' : '';
    return duration;
  }

  convertNoteToKey(noteName: string) {
    let accidental = noteName.length > 1 ? noteName[1] : '';
    let note = noteName[0];
    let cancelAcc = this.keySignature.sharpsFlatSymbol === '#' ? 'b' : '#';

    let sharpFlatKeys = CONST.KEY_ORDER[this.keySignature.scale as string][this.keySignature.sharpsFlat].slice(
      0,
      Math.abs(this.key),
    );
    if (sharpFlatKeys.includes(note) && accidental === this.keySignature.sharpsFlatSymbol) {
      return {
        note,
        accidental: '',
      };
    } else if (sharpFlatKeys.includes(note) && accidental == '') {
      return {
        note,
        accidental: cancelAcc,
      };
      // } else if (sharpFlatKeys.includes(note) && accidental == cancelAcc) {
      // 	//TODO
      // 	return {
      // 		note,
      // 		accidental
      // 	}
    } else {
      return {
        note,
        accidental,
      };
    }
  }

  getGroupedNotes(measure: RoundedNote[], quantize: QuantizeFunction) {
    const groupedMeasure: RoundedNotesByQuantizedTimestamp = {};
    measure.forEach((roundedNote) => {
      let quantizedTsp = quantize(roundedNote.note.timestamp);
      if (!groupedMeasure.hasOwnProperty(quantizedTsp)) {
        groupedMeasure[quantizedTsp] = [];
      }
      groupedMeasure[quantizedTsp].push(roundedNote);
    });
    return groupedMeasure;
  }

  getStave(x: number, y: number, measureWidth: number, clef: string, isFirstInRow: boolean, end: boolean) {
    const staveMeasure = new Vex.Flow.Stave(x, y, measureWidth);
    if (isFirstInRow) {
      // TODO: 버전 이슈로 수정했음.
      staveMeasure
        .setKeySignature(this.keySignatureName, this.keySignatureName)
        .addClef(clef)
        .addTimeSignature(`${this.numerator}/${this.denominator}`);
    }
    if (end) {
      staveMeasure.setEndBarType(Vex.Flow.Barline.type.END);
    }
    // @ts-ignore
    staveMeasure.clef = clef;

    return staveMeasure;
  }

  getMeasure(measureIndex: number) {
    return this.measureObjects[measureIndex] ? this.measureObjects[measureIndex] : null;
  }

  getMeasureSvg(measureIndex: number) {
    let measure = this.getMeasure(measureIndex);
    return measure ? measure.div.querySelector('svg') : null;
  }

  // TODO: 현재 필요없는 메서드. 추후 필요하면 수정
  // computeStaffYs() {
  //   this.staffYs = {};

  //   let curY = 15;

  //   for (let key in this.yBounds) {
  //     let bounds = this.yBounds[key];
  //     let relY = 0 - bounds.min;
  //     curY += relY;

  //     this.staffYs[key] = {};
  //     this.staffYs[key].min = curY;
  //     curY += bounds.max - bounds.min + 4;
  //     this.staffYs[key].max = curY;
  //   }
  // }
}

export function getNotesInTimewindow(start: number, end: number, notesBySecond: NotesBySeconds) {
  const notes: MidiChannelSongNoteEventWithIsOn[] = [];
  for (let i = Math.floor(start / 1000); i <= Math.ceil(end / 1000); i++) {
    if (notesBySecond.hasOwnProperty(i)) {
      notesBySecond[i].forEach((note) => {
        if (note.timestamp >= start && note.timestamp < end) {
          notes.push(note);
        }
      });
    }
  }

  return notes;
}

export function flattenMeasures(measuresBySecond: MeasuresBySecond, songEnd: number) {
  const measures: IMeasure[] = [];
  for (const second in measuresBySecond) {
    measuresBySecond[second].forEach((measure) => {
      // TODO: 타입 추론 이상하게 되서 무시처리함. 문제 생기면 수정
      // @ts-ignore
      measures.push(measure);
    });
  }
  let lastDur = measures[measures.length - 1][0] - measures[measures.length - 2][0];
  measures.push([songEnd, measures[measures.length - 1][1] + 1]);
  measures.splice(0, 1);

  return measures;
}

export function mapDurationToAlias(roundedNote: RoundedNote) {
  let alias = Math.min(128, 1 / roundedNote.denom);
  if (alias < 0.5) {
    alias = 0.5;
  }

  return alias;
}
