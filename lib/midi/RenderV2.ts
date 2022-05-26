// @ts-nocheck

import { BackgroundRender } from '@lib/Rendering/BackgroundRender';
import { DebugRender } from '@lib/Rendering/DebugRender';
import { InSongTextRenderer } from '@lib/Rendering/InSongTextRenderer';
import { MarkerRenderer } from '@lib/Rendering/MarkerRenderer';
import { MeasureLinesRender } from '@lib/Rendering/MeasureLinesRender';
import { OverlayRender } from '@lib/Rendering/OverlayRender';
import { PianoRender } from '@lib/Rendering/PianoRender';
import { ProgressBarRender } from '@lib/Rendering/ProgressBarRender';
import { SustainRender } from '@lib/Rendering/SustainRenderer';
import { threeJsRender } from '@lib/Rendering/ThreeJs/threeJsHandler';
import { isBlack } from '@utils/util';
import { getSetting, setSettingCallback } from '../settings/Settings';
import { SheetRender } from '../sheet/SheetRender';
import { DomHelper } from '../ui/DomHelper';
import { createKeyBinder, getKeyBinder } from '../ui/KeyBinder';
import CONST from './CONST';
import { NoteRender } from './NoteRender';
import Player, { PlayerState } from './Player';
import { RenderDimensions } from './RenderDimensions';
import { getTrackColor, isTrackDrawn } from './Tracks';

const DEBUG = true;

export const PROGRESS_BAR_CANVAS_HEIGHT = 25;

/**
 * Class that handles all rendering
 */
export class Render {
  renderDimensions: RenderDimensions;
  pianoRender: PianoRender;
  overlayRender: OverlayRender;
  debugRender: DebugRender;
  sheetRender: SheetRender;
  noteRender: NoteRender;
  sustainRender: SustainRender;
  markerRender: MarkerRenderer;
  inSongTextRender: InSongTextRenderer;
  measureLinesRender: MeasureLinesRender;
  progressBarRender: ProgressBarRender;
  backgroundRender: BackgroundRender;
  fpsFilterStrength: number;
  frameTime: number;
  cnv: any;
  ctx: CanvasRenderingContext2D;
  cnvForeground: any;
  ctxForeground: any;
  sheetCnv: any;
  ctxSheet: any;
  progressBarCanvas: any;
  progressBarCtx: any;

  constructor() {
    this.renderDimensions = new RenderDimensions();
    this.renderDimensions.registerResizeCallback(this.setupCanvases.bind(this));

    createKeyBinder(this.renderDimensions);

    // getPlayer => Player.getInstance() 로 변경했음.
    Player.getInstance().addNewSongCallback(() => {
      if (getSetting('fitZoomOnNewSong')) {
        this.renderDimensions.fitSong(Player.getInstance().song?.getNoteRange());
      }
    });
    setSettingCallback('particleBlur', this.setCtxBlur.bind(this));
    setSettingCallback('particleRenderBehind', this.setFgCtxZIndex.bind(this));

    this.setupCanvases();

    this.pianoRender = new PianoRender(this.renderDimensions);
    this.overlayRender = new OverlayRender(this.ctx, this.renderDimensions);
    this.debugRender = new DebugRender(DEBUG, this.ctx, this.renderDimensions);
    this.sheetRender = new SheetRender(this.ctxSheet, this.renderDimensions);

    this.resizeTimer = null;
    window.addEventListener('resize', () => {
      if (this.sheetRender.active) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() =>
          Player.getInstance().song?.sheetGen.computeLines(
            this.renderDimensions.windowWidth / this.scale,
            SHEET_SIDE_MARGIN / this.scale,
            50,
          ),
        );
      }
    });

    this.noteRender = new NoteRender(this.ctx, this.ctxForeground, this.renderDimensions, this.pianoRender);

    this.sustainRender = new SustainRender(this.ctx, this.renderDimensions);
    this.markerRender = new MarkerRenderer(this.ctx, this.renderDimensions);
    this.inSongTextRender = new InSongTextRenderer(this.ctx, this.renderDimensions);
    this.measureLinesRender = new MeasureLinesRender(this.ctx, this.renderDimensions);
    this.progressBarRender = new ProgressBarRender(this.progressBarCtx, this.renderDimensions);
    this.backgroundRender = new BackgroundRender(this.ctxBG, this.renderDimensions);

    //Needed for FPS calc
    this.fpsFilterStrength = 10;
    this.frameTime = 0;
    this.lastTimestamp = window.performance.now();

    this.mouseX = 0;
    this.mouseY = 0;

    this.playerState = Player.getInstance().getState();

    this.showKeyNamesOnPianoWhite = getSetting('showKeyNamesOnPianoWhite');
    this.showKeyNamesOnPianoBlack = getSetting('showKeyNamesOnPianoBlack');
    this.drawPianoShadows = getSetting('disableKeyShadows');
  }

  setCtxBlur() {
    let blurPx = parseInt(getSetting('particleBlur'));
    if (blurPx == 0) {
      this.ctxForeground.filter = 'none';
    } else {
      this.ctxForeground.filter = 'blur(' + blurPx + 'px)';
    }
  }

  setPianoInputListeners(onNoteOn, onNoteOff) {
    this.pianoRender.setPianoInputListeners(onNoteOn, onNoteOff);
  }

  /**
   * Main rendering function
   */
  render(playerState) {
    this.playerState = playerState;
    this.ctx.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.ctxForeground.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);

    this.pianoRender.clearPlayedKeysCanvases();
    if (
      this.showKeyNamesOnPianoWhite != getSetting('showKeyNamesOnPianoWhite') ||
      this.showKeyNamesOnPianoBlack != getSetting('showKeyNamesOnPianoBlack') ||
      this.showPianoKeyNameFlats != getSetting('showPianoKeyNameFlats') ||
      this.drawPianoShadows != getSetting('disableKeyShadows')
    ) {
      this.showKeyNamesOnPianoWhite = getSetting('showKeyNamesOnPianoWhite');
      this.showKeyNamesOnPianoBlack = getSetting('showKeyNamesOnPianoBlack');
      this.showPianoKeyNameFlats = getSetting('showPianoKeyNameFlats');
      this.drawPianoShadows = getSetting('disableKeyShadows');
      this.pianoRender.resize();
    }

    threeJsRender(playerState.time);

    getKeyBinder().render();

    this.backgroundRender.renderIfColorsChanged();

    let renderInfosByTrackMap = this.getRenderInfoByTrackMap(playerState);
    // console.log({ renderInfosByTrackMap });
    let inputActiveRenderInfos = this.getInputActiveRenderInfos(playerState);
    let inputPlayedRenderInfos = this.getInputPlayedRenderInfos(playerState);

    if (this.sheetCnv) {
      if (playerState.song) {
        this.sheetRender.render(
          playerState.time,
          playerState.song.sheetGen,
          inputActiveRenderInfos,
          this.mouseX,
          this.mouseY,
        );
      }
      this.sheetRender.active = true;
    } else {
      this.sheetRender.active = false;
    }
    const time = this.getRenderTime(playerState);
    const end = playerState.end;
    if (!playerState.loading && playerState.song) {
      const measureLines = playerState.song ? playerState.song.getMeasureLines() : [];

      this.progressBarRender.render(time, end, playerState.song.markers);
      this.measureLinesRender.render(time, measureLines);
      this.sustainRender.render(time, playerState.song.sustainsByChannelAndSecond, playerState.song.sustainPeriods);

      //   const random = Math.random();
      //   if (random < 0.05) {
      //     console.log({ inputActiveRenderInfos });
      //     console.log({ inputPlayedRenderInfos });
      //   }

      this.noteRender.render(time, renderInfosByTrackMap, inputActiveRenderInfos, inputPlayedRenderInfos);
      this.markerRender.render(time, playerState.song.markers);
      this.inSongTextRender.render(time, playerState.song.markers);
    }

    this.overlayRender.render();

    this.debugRender.render(renderInfosByTrackMap, this.mouseX, this.mouseY);

    if (getSetting('showBPM')) {
      this.drawBPM(playerState);
    }
    if (getSetting('showFps')) {
      this.drawFPS();
    }
  }
  /**
   * Returns current time adjusted for the render-offset from the settings
   * @param {Object} playerState
   */
  getRenderTime(playerState) {
    return playerState.time + getSetting('renderOffset') / 1000;
  }
  getRenderInfoByTrackMap(playerState) {
    let renderInfoByTrackMap = {};
    if (playerState)
      if (playerState.song) {
        playerState.song.activeTracks.forEach((track, trackIndex) => {
          if (isTrackDrawn(trackIndex)) {
            let notesDrawn = new Set();
            renderInfoByTrackMap[trackIndex] = { black: [], white: [] };

            let time = this.getRenderTime(playerState);
            // 처음 값은 -10
            let firstSecondShown = Math.floor(
              time - this.renderDimensions.getSecondsDisplayedAfter() - CONST.LOOKBACKTIME,
            );
            // 처음 값은 -2
            let lastSecondShown = Math.ceil(time + this.renderDimensions.getSecondsDisplayedBefore());

            for (let i = firstSecondShown; i < lastSecondShown; i++) {
              if (track.notesBySeconds[i]) {
                track.notesBySeconds[i]
                  // .filter(note => note.instrument != "percussion")
                  .map((note) => {
                    notesDrawn.add(note);
                    const n = this.getNoteRenderInfo(note, time);
                    return n;
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
              .map((note) => this.getNoteRenderInfo(note, time))
              // .map((note) => {
              //     return note;
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
  getInputActiveRenderInfos(playerState: PlayerState) {
    let inputRenderInfos = [];
    for (let key in playerState.inputActiveNotes) {
      let activeInputNote = playerState.inputActiveNotes[key];
      inputRenderInfos.push(
        this.getNoteRenderInfo(
          {
            timestamp: activeInputNote.timestamp,
            noteNumber: activeInputNote.noteNumber,
            offTime: playerState.ctxTime * 1000 + 0,
            duration: playerState.ctxTime * 1000 - activeInputNote.timestamp,
            velocity: 127,
            fillStyle: isBlack(activeInputNote.noteNumber)
              ? getSetting('inputNoteColorBlack')
              : getSetting('inputNoteColorWhite'),
            isOn: true,
            id: 'input' + activeInputNote.noteNumber + activeInputNote.timestamp,
          },
          playerState.ctxTime,
        ),
      );
    }
    return inputRenderInfos;
  }
  getInputPlayedRenderInfos(playerState: PlayerState) {
    let inputRenderInfos = [];
    for (let key in playerState.inputPlayedNotes) {
      let playedInputNote = playerState.inputPlayedNotes[key];
      if (
        this.renderDimensions.getSecondsDisplayedAfter() >
        Math.floor((playerState.ctxTime * 1000 - playedInputNote.offTime) / 1000)
      ) {
        inputRenderInfos.push(
          this.getNoteRenderInfo(
            {
              timestamp: playedInputNote.timestamp,
              noteNumber: playedInputNote.noteNumber,
              offTime: playedInputNote.offTime,
              duration: playerState.ctxTime * 1000 - playedInputNote.timestamp,
              velocity: 127,
              fillStyle: isBlack(playedInputNote.noteNumber)
                ? getSetting('inputNoteColorBlack')
                : getSetting('inputNoteColorWhite'),
            },
            playerState.ctxTime,
          ),
        );
      }
    }
    return inputRenderInfos;
  }

  getNoteRenderInfo(note, time: number) {
    time *= 1000;
    let noteDims = this.renderDimensions.getNoteDimensions(
      note.noteNumber,
      time,
      note.timestamp,
      note.offTime,
      note.sustainOffTime,
    );
    //overwrite isOn for input notes. As they are continuous and would otherwise always appear to be already played
    let isOn = note.isOn ? note.isOn : note.timestamp < time && note.offTime > time ? 1 : 0;
    // 노트가 연주된 시간
    let elapsedTime = Math.max(0, time - note.timestamp);
    // 노트가 연주된 비율
    let noteDoneRatio = elapsedTime / note.duration;

    let isKeyBlack = isBlack(note.noteNumber);
    //TODO Clean up. Right now it returns more info than necessary to use in DebugRender..
    return {
      noteNumber: note.noteNumber,
      timestamp: note.timestamp,
      offTime: note.offTime,
      duration: note.duration,
      instrument: note.instrument,
      track: note.track,
      channel: note.channel,
      fillStyle: note.fillStyle
        ? note.fillStyle
        : isKeyBlack
        ? getTrackColor(note.track).black
        : getTrackColor(note.track).white,
      currentTime: time,
      isBlack: isKeyBlack,
      noteDims: noteDims,
      isOn: isOn,
      noteDoneRatio: noteDoneRatio,
      rad: noteDims.rad,
      x: noteDims.x,
      y: noteDims.y,
      w: noteDims.w,
      h: noteDims.h,
      sustainH: noteDims.sustainH,
      sustainY: noteDims.sustainY,
      velocity: note.velocity,
      noteId: note.id,
    };
  }

  drawBPM(playerState: PlayerState) {
    this.ctx.font = '1em Arial black';
    this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(
      Math.round(playerState.bpm) + ' BPM',
      20,
      this.renderDimensions.menuHeight + PROGRESS_BAR_CANVAS_HEIGHT + this.renderDimensions.sheetHeight + 12,
    );
  }

  drawFPS() {
    this.thisTimestamp = window.performance.now();

    let timePassed = this.thisTimestamp - this.lastTimestamp;
    this.frameTime += (timePassed - this.frameTime) / this.fpsFilterStrength;
    this.ctx.font = '1em Arial black';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
    let txtMetrics = this.ctx.measureText('M').width;
    this.ctx.fillText(
      (1000 / this.frameTime).toFixed(0) + ' FPS',
      20,
      this.renderDimensions.menuHeight +
        PROGRESS_BAR_CANVAS_HEIGHT +
        this.renderDimensions.sheetHeight +
        12 +
        (getSetting('showBPM') ? 1 : 0) * txtMetrics * 1.2,
    );

    this.lastTimestamp = this.thisTimestamp;
  }

  addStartingOverlayMessage() {
    this.overlayRender.addOverlay('MIDiano', 150);
    this.overlayRender.addOverlay('A Javascript MIDI-Player', 150);
    this.overlayRender.addOverlay('Example song by Bernd Krueger from piano-midi.de', 150);
  }

  /**
   *
   */
  setupCanvases() {
    DomHelper.setCanvasSize(this.getBgCanvas(), this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.getBgCanvas().style.zIndex = 0;

    DomHelper.setCanvasSize(
      this.getMainCanvas(),
      this.renderDimensions.windowWidth,
      this.renderDimensions.windowHeight,
    );
    this.getMainCanvas().style.zIndex = 2;

    DomHelper.setCanvasSize(this.getProgressBarCanvas(), this.renderDimensions.windowWidth, PROGRESS_BAR_CANVAS_HEIGHT);
    this.getProgressBarCanvas().style.bottom = -PROGRESS_BAR_CANVAS_HEIGHT + 'px';

    DomHelper.setCanvasSize(
      this.getForegroundCanvas(),
      this.renderDimensions.windowWidth,
      this.renderDimensions.windowHeight,
    );

    let sheetHeight = this.sheetRender ? this.sheetRender.getSheetHeight() : 300;
    DomHelper.setCanvasSize(this.getSheetCanvas(), this.renderDimensions.windowWidth, sheetHeight);
    this.getSheetCanvas().style.bottom = -sheetHeight - PROGRESS_BAR_CANVAS_HEIGHT + 'px';
    this.setFgCtxZIndex();
    this.setCtxBlur();
  }
  setFgCtxZIndex() {
    this.getForegroundCanvas().style.zIndex = getSetting('particleRenderBehind') ? 1 : 100;
  }
  getBgCanvas() {
    if (!this.cnvBG) {
      this.cnvBG = DomHelper.createCanvas(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight, {
        backgroundColor: 'black',
        position: 'absolute',
        top: '0px',
        left: '0px',
      });
      document.body.appendChild(this.cnvBG);
      this.ctxBG = this.cnvBG.getContext('2d');
    }
    return this.cnvBG;
  }
  getMainCanvas() {
    if (!this.cnv) {
      this.cnv = DomHelper.createCanvas(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight, {
        position: 'absolute',
        top: '0px',
        left: '0px',
      });
      document.body.appendChild(this.cnv);
      this.ctx = this.cnv.getContext('2d');
    }
    return this.cnv;
  }
  getForegroundCanvas() {
    if (!this.cnvForeground) {
      this.cnvForeground = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        this.renderDimensions.windowHeight,
        {
          position: 'absolute',
          top: '0px',
          left: '0px',
        },
      );
      this.cnvForeground.style.pointerEvents = 'none';
      this.cnvForeground.style.zIndex = '101';
      document.body.appendChild(this.cnvForeground);
      this.ctxForeground = this.cnvForeground.getContext('2d');
    }
    return this.cnvForeground;
  }
  getSheetCanvas() {
    if (!this.sheetCnv) {
      this.sheetCnv = DomHelper.createCanvas(this.renderDimensions.windowWidth, 700);
      this.sheetCnv.id = 'sheetCnv';
      this.ctxSheet = this.sheetCnv.getContext('2d');

      if (!getSetting('enableSheet')) {
        this.renderDimensions.setSheetHeight(0);
        DomHelper.hideDiv(this.sheetCnv);
      }

      setSettingCallback('enableSheet', () => {
        if (getSetting('enableSheet')) {
          DomHelper.showDiv(this.sheetCnv);
        } else {
          this.renderDimensions.setSheetHeight(0);
          DomHelper.hideDiv(this.sheetCnv);
        }
      });
    }
    return this.sheetCnv;
  }

  getProgressBarCanvas() {
    if (!this.progressBarCanvas) {
      this.progressBarCanvas = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        PROGRESS_BAR_CANVAS_HEIGHT,
        {},
      );
      this.progressBarCanvas.id = 'progressBarCanvas';
      this.progressBarCtx = this.progressBarCanvas.getContext('2d');
    }
    return this.progressBarCanvas;
  }

  isNoteDrawn(note, tracks) {
    return !tracks[note.track] || !tracks[note.track].draw;
  }

  isOnMainCanvas(position) {
    return (
      (position.x > this.renderDimensions.menuHeight &&
        position.y < this.renderDimensions.getAbsolutePianoPosition()) ||
      position.y > this.renderDimensions.getAbsolutePianoPosition() + this.renderDimensions._whiteKeyHeight
    );
  }

  setMouseCoords(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  getTimeFromHeight(height) {
    return (
      (height * this.renderDimensions.getNoteToHeightConst()) /
      (this.renderDimensions.windowHeight - this.renderDimensions._whiteKeyHeight) /
      1000
    );
  }
}
