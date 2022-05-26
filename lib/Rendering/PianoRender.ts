// @ts-nocheck

import { DomHelper } from '../ui/DomHelper.js';
import { getSetting, setSettingCallback } from '../settings/Settings.js';
import { formatNote, isBlack } from '@utils/util';
import { RenderDimensions } from '@lib/midi/RenderDimensions.js';
/**
 * Class to render the piano (and the colored keys played on the piano)
 */
export class PianoRender {
  renderDimensions: RenderDimensions;
  blackKeyImg: HTMLImageElement;
  positionY: number;

  constructor(renderDimensions: RenderDimensions) {
    this.renderDimensions = renderDimensions;
    this.renderDimensions.registerResizeCallback(this.resize.bind(this));
    this.clickCallback = null;
    this.blackKeyImg = new Image();
    this.blackKeyImg.src = '../../blackKey.svg';
    this.blackKeyImg.onload;
    this.positionY = 50; //from bottom

    setSettingCallback('pianoWhiteKeyColor', this.resize.bind(this));
    setSettingCallback('pianoBlackKeyColor', this.resize.bind(this));
    setSettingCallback('pianoBackgroundColor', this.resize.bind(this));

    this.resize();
  }
  /**
   * Resize canvases and redraw piano.
   */
  resize() {
    this.resizeCanvases();
    this.drawPiano(this.ctxWhite, this.ctxBlack);
  }
  /**
   * pass listeners that are called with the note number as argument when piano canvas is clicked.
   * @param {Function} onNoteOn
   * @param {Function} onNoteOff
   */
  setPianoInputListeners(onNoteOn: Function, onNoteOff: Function) {
    this.onNoteOn = onNoteOn;
    this.onNoteOff = onNoteOff;
  }
  /**
   * Register a callback to trigger when user clicks the piano Canvas. Callback is called with
   */
  setClickCallback(callback) {
    this.clickCallback = callback;
  }
  getAllCanvases() {
    return [
      this.getPianoCanvasWhite(),
      this.getPlayedKeysWhite(),
      this.getPianoCanvasBlack(),
      this.getPlayedKeysBlack(),
    ];
  }

  /**
   * Resizes all piano canvases.
   */
  resizeCanvases() {
    this.getAllCanvases().forEach((canvas) => {
      DomHelper.setCanvasSize(
        canvas,
        this.renderDimensions.windowWidth,
        Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
      );
    });
    this.repositionCanvases();
  }

  repositionCanvases() {
    this.getAllCanvases().forEach((canvas) => {
      canvas.style.top = this.renderDimensions.getAbsolutePianoPosition() + 'px';
    });
  }
  /**
   *
   * @param {Integer} noteNumber
   */
  drawActiveInputKey(noteNumber: number, color: string) {
    let dim = this.renderDimensions.getKeyDimensions(noteNumber);
    let isKeyBlack = isBlack(noteNumber);
    let ctx = isKeyBlack ? this.playedKeysCtxBlack : this.playedKeysCtxWhite;

    ctx.globalCompositeOperation = getSetting('pianoEnableLighter') ? 'lighter' : 'source-over';
    ctx.shadowColor = getSetting('pianoShadowColor');
    ctx.shadowBlur = getSetting('pianoShadowBlur');
    if (isKeyBlack) {
      this.drawBlackKey(ctx, dim, color, false);
    } else {
      this.drawWhiteKey(ctx, dim, color, false);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  drawActiveKey(renderInfo, color) {
    let dim = this.renderDimensions.getKeyDimensions(renderInfo.noteNumber);
    let isKeyBlack = renderInfo.isBlack;
    let ctx = isKeyBlack ? this.playedKeysCtxBlack : this.playedKeysCtxWhite;

    let velocityStartFrames = 1;
    let startTimeRatio = 1;
    if (getSetting('drawPianoKeyHitEffect')) {
      velocityStartFrames = (327 - renderInfo.velocity) / 1; // ~65 -> 40
      startTimeRatio = Math.min(1, 0.6 + (renderInfo.currentTime - renderInfo.timestamp) / velocityStartFrames);
    }

    ctx.globalCompositeOperation = getSetting('pianoEnableLighter') ? 'lighter' : 'source-over';
    ctx.shadowColor = getSetting('pianoShadowColor');
    ctx.shadowBlur = getSetting('pianoShadowBlur');
    ctx.fillStyle = color;
    if (isKeyBlack) {
      this.drawBlackKey(ctx, dim, color, false, 0.8, startTimeRatio);
    } else {
      this.drawWhiteKey(ctx, dim, color, false, 0.8, startTimeRatio);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  clearPlayedKeysCanvases() {
    this.playedKeysCtxWhite.clearRect(
      0,
      0,
      this.renderDimensions.windowWidth,
      Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
    );
    this.playedKeysCtxBlack.clearRect(
      0,
      0,
      this.renderDimensions.windowWidth,
      Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
    );
  }

  drawPiano(ctxWhite, ctxBlack) {
    ctxWhite.clearRect(
      0,
      0,
      this.renderDimensions.windowWidth,
      Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
    );
    ctxBlack.clearRect(
      0,
      0,
      this.renderDimensions.windowWidth,
      Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
    );
    // Background
    ctxWhite.fillStyle = getSetting('pianoBackgroundColor');
    ctxWhite.fillRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.whiteKeyHeight);

    this.drawWhiteKeys(ctxWhite);
    if (getSetting('showKeyNamesOnPianoWhite')) {
      this.drawWhiteKeyNames(ctxWhite);
    }
    // var img = new Image()
    // img.src = "../../blackKey.svg"
    // img.onload = function () {
    this.drawBlackKeys(ctxBlack);
    if (getSetting('showKeyNamesOnPianoBlack')) {
      this.drawBlackKeyNames(ctxBlack);
    }

    // }.bind(this)

    //velvet
    // ctxWhite.strokeStyle = "rgba(155,50,50,1)"
    // ctxWhite.shadowColor = "rgba(155,50,50,1)"
    // ctxWhite.shadowOffsetY = 2
    // ctxWhite.shadowBlur = 2
    // ctxWhite.lineWidth = 4
    // ctxWhite.beginPath()
    // ctxWhite.moveTo(this.renderDimensions.windowWidth, 2)
    // ctxWhite.lineTo(0, 2)
    // ctxWhite.closePath()
    // ctxWhite.stroke()
    // ctxWhite.shadowColor = "rgba(0,0,0,0)"
    // ctxWhite.shadowBlur = 0
  }

  drawWhiteKeys(ctxWhite) {
    for (let i = Math.max(0, this.renderDimensions.minNoteNumber); i <= this.renderDimensions.maxNoteNumber; i++) {
      let dims = this.renderDimensions.getKeyDimensions(i);
      if (!isBlack(i)) {
        this.drawWhiteKey(ctxWhite, dims, getSetting('pianoWhiteKeyColor'));
      }
    }
  }

  drawBlackKeys(ctxBlack) {
    for (let i = Math.max(0, this.renderDimensions.minNoteNumber); i <= this.renderDimensions.maxNoteNumber; i++) {
      let dims = this.renderDimensions.getKeyDimensions(i);
      if (isBlack(i)) {
        this.drawBlackKey(ctxBlack, dims, getSetting('pianoBlackKeyColor'), true);
      }
    }
  }
  drawWhiteKeyNames(ctx) {
    ctx.fillStyle = 'black';
    const fontSize = this.renderDimensions.whiteKeyWidth / 2.2;
    ctx.font = fontSize + 'px Arial black';
    for (let i = Math.max(0, this.renderDimensions.minNoteNumber); i <= this.renderDimensions.maxNoteNumber; i++) {
      let dims = this.renderDimensions.getKeyDimensions(i);
      if (!isBlack(i)) {
        let txt = formatNote(i + 21);
        let txtWd = ctx.measureText(txt).width;
        ctx.fillText(txt, dims.x + dims.w / 2 - txtWd / 2, this.renderDimensions.whiteKeyHeight - fontSize / 3);
      }
    }
  }
  drawBlackKeyNames(ctx) {
    ctx.fillStyle = 'white';
    const fontSize = this.renderDimensions.blackKeyWidth / 2.1;
    ctx.font = Math.ceil(fontSize) + 'px Arial black';
    for (let i = Math.max(0, this.renderDimensions.minNoteNumber); i <= this.renderDimensions.maxNoteNumber; i++) {
      let dims = this.renderDimensions.getKeyDimensions(i);
      if (isBlack(i)) {
        let txt = formatNote(i + 21);
        let txtWd = ctx.measureText(txt).width;
        ctx.fillText(txt, dims.x + dims.w / 2 - txtWd / 2, this.renderDimensions.blackKeyHeight - 2);
      }
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Dimensions} dims
   */
  drawWhiteKey(ctx, dims, color, noShadow, a, startTimeRatio) {
    startTimeRatio = startTimeRatio || 1;

    let radius = Math.ceil(this.renderDimensions.whiteKeyWidth / 20);
    let x = dims.x;
    let y = Math.floor(dims.y);
    let height = Math.floor(dims.h);
    let width = dims.w / startTimeRatio;
    x -= (width - dims.w) / 2;

    this.getWhiteKeyPath(ctx, x, y, width, height, radius);

    ctx.fillStyle = color;
    ctx.fill();
    if (!noShadow && !getSetting('disableKeyShadows')) {
      ctx.fillStyle = this.getKeyGradient(ctx, a);
      ctx.fill();
    }

    ctx.closePath();
  }
  getKeyGradient(ctx, a) {
    a = a || 1;
    if (this.keyGradient == null || this.keyGradientA != a) {
      this.keyGradient = ctx.createLinearGradient(
        this.renderDimensions.windowWidth / 2,
        0,
        this.renderDimensions.windowWidth / 2,
        this.renderDimensions.whiteKeyHeight,
      );
      this.keyGradient.addColorStop(0, 'rgba(0,0,0,' + a + ')');
      this.keyGradient.addColorStop(1, 'rgba(255,255,255,' + 0 + ')');
      this.keyGradientA = a;
    }
    return this.keyGradient;
  }
  getWhiteKeyPath(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + 1, y);

    ctx.lineTo(x - 1 + width, y);

    ctx.lineTo(x - 1 + width, y + height - radius);
    ctx.lineTo(x - 1 + width - radius, y + height);
    ctx.lineTo(x + 1 + radius, y + height);
    ctx.lineTo(x + 1, y + height - radius);
    ctx.lineTo(x + 1, y);
  }

  strokeWhiteKey(dims, color) {
    let radius = Math.ceil(this.renderDimensions.whiteKeyWidth / 20);
    let x = dims.x;
    let y = Math.floor(dims.y) + 6;
    let height = Math.floor(dims.h) - 8;
    let width = dims.w;
    let ctx = this.playedKeysCtxWhite;

    this.getWhiteKeyPath(ctx, x, y, width, height, radius);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 50;
    ctx.fill();
    ctx.closePath();
  }
  drawBlackKeySvg(ctx, dims, color) {
    let radiusTop = this.renderDimensions.blackKeyWidth / 15;
    let radiusBottom = this.renderDimensions.blackKeyWidth / 8;
    let x = dims.x;
    let y = dims.y + 5;
    let height = dims.h;
    let width = dims.w;

    ctx.drawImage(this.blackKeyImg, x, y, width, height);
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Dimensions} dims
   */
  drawBlackKey(ctx: CanvasRenderingContext2D, dims, color, noShadow, a, startTimeRatio) {
    startTimeRatio = startTimeRatio || 1;
    color = color || 'black';

    let radiusTop = 0; //this.renderDimensions.blackKeyWidth / 15
    let radiusBottom = this.renderDimensions.blackKeyWidth / 8;
    let x = dims.x;
    let y = dims.y;
    let height = dims.h;
    let width = dims.w / startTimeRatio;
    x -= (width - dims.w) / 2;

    this.getBlackKeyPath(ctx, x, y, radiusTop, width, height, radiusBottom);

    ctx.fillStyle = color;
    ctx.fill();
    if (!noShadow && !getSetting('disableKeyShadows')) {
      ctx.fillStyle = this.getKeyGradient(ctx, a);
      ctx.fill();
    }
    ctx.closePath();
  }
  strokeBlackKey(dims, color) {
    let radiusTop = 0; //this.renderDimensions.blackKeyWidth / 15
    let radiusBottom = this.renderDimensions.blackKeyWidth / 8;
    let x = dims.x;
    let y = dims.y + 6;
    let height = dims.h;
    let width = dims.w;
    let ctx = this.playedKeysCtxBlack;
    color = color || 'white';

    this.getBlackKeyPath(ctx, x, y, radiusTop, width, height, radiusBottom);

    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }

  getBlackKeyPath(ctx, x, y, radiusTop, width, height, radiusBottom) {
    ctx.beginPath();
    ctx.moveTo(x + 1, y + radiusTop);
    ctx.lineTo(x + 1 + radiusTop, y);
    ctx.lineTo(x - 1 - radiusTop + width, y);
    ctx.lineTo(x - 1 + width, y + radiusTop);
    ctx.lineTo(x - 1 + width, y + height - radiusBottom);
    ctx.lineTo(x - 1 + width - radiusBottom, y + height);
    ctx.lineTo(x + 1 + radiusBottom, y + height);
    ctx.lineTo(x + 1, y + height - radiusBottom);
    ctx.lineTo(x + 1, y);
  }

  getPianoCanvasWhite() {
    if (!this.pianoCanvasWhite) {
      this.pianoCanvasWhite = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
        {
          position: 'absolute',
          left: '0px',
          zIndex: 99,
        },
      );
      this.pianoCanvasWhite.className = 'pianoCanvas';
      document.body.appendChild(this.pianoCanvasWhite);
      this.ctxWhite = this.pianoCanvasWhite.getContext('2d');
    }
    return this.pianoCanvasWhite;
  }
  getPlayedKeysWhite() {
    if (!this.playedKeysCanvasWhite) {
      this.playedKeysCanvasWhite = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
        {
          position: 'absolute',
          left: '0px',
          zIndex: 99,
        },
      );
      this.playedKeysCanvasWhite.className = 'pianoCanvas';
      document.body.appendChild(this.playedKeysCanvasWhite);
      this.playedKeysCtxWhite = this.playedKeysCanvasWhite.getContext('2d');
    }
    return this.playedKeysCanvasWhite;
  }
  getPianoCanvasBlack() {
    if (!this.pianoCanvasBlack) {
      this.pianoCanvasBlack = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
        {
          position: 'absolute',
          left: '0px',
          zIndex: 99,
          // boxShadow: "0px 0px 15px 15px rgba(0,0,0,0.4)"
        },
      );
      this.pianoCanvasBlack.className = 'pianoCanvas';
      document.body.appendChild(this.pianoCanvasBlack);
      this.ctxBlack = this.pianoCanvasBlack.getContext('2d');
    }
    return this.pianoCanvasBlack;
  }
  getPlayedKeysBlack() {
    if (!this.playedKeysCanvasBlack) {
      this.playedKeysCanvasBlack = DomHelper.createCanvas(
        this.renderDimensions.windowWidth,
        Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight),
        {
          position: 'absolute',
          left: '0px',
          zIndex: 99,
        },
      );
      this.playedKeysCanvasBlack.className = 'pianoCanvas';
      document.body.appendChild(this.playedKeysCanvasBlack);
      this.playedKeysCtxBlack = this.playedKeysCanvasBlack.getContext('2d');

      this.playedKeysCanvasBlack.addEventListener('mousedown', this.onPianoMousedown.bind(this));
      this.playedKeysCanvasBlack.addEventListener('mouseup', this.onPianoMouseup.bind(this));
      this.playedKeysCanvasBlack.addEventListener('mousemove', this.onPianoMousemove.bind(this));
      this.playedKeysCanvasBlack.addEventListener('mouseleave', this.onPianoMouseleave.bind(this));

      this.playedKeysCanvasBlack.addEventListener('touchstart', this.onPianoMousedown.bind(this));
      this.playedKeysCanvasBlack.addEventListener('touchend', this.onPianoMouseup.bind(this));
      this.playedKeysCanvasBlack.addEventListener('touchmove', this.onPianoMousemove.bind(this));
    }
    return this.playedKeysCanvasBlack;
  }
  onPianoMousedown(ev) {
    ev.preventDefault();
    if (getSetting('clickablePiano')) {
      let { x, y } = this.getCanvasPosFromMouseEvent(ev);
      let keyUnderMouse = this.getKeyAtPos(x, y);
      if (keyUnderMouse >= 0) {
        this.currentKeyUnderMouse = keyUnderMouse;
        this.isMouseDown = true;
        this.onNoteOn(keyUnderMouse);
      } else {
        this.clearCurrentKeyUnderMouse();
      }
    }
  }

  onPianoMouseup(ev) {
    ev.preventDefault();
    this.isMouseDown = false;
    this.clearCurrentKeyUnderMouse();
  }
  onPianoMouseleave(ev) {
    ev.preventDefault();
    this.isMouseDown = false;
    this.clearCurrentKeyUnderMouse();
  }

  onPianoMousemove(ev) {
    ev.preventDefault();
    if (getSetting('clickablePiano')) {
      let { x, y } = this.getCanvasPosFromMouseEvent(ev);
      let keyUnderMouse = this.getKeyAtPos(x, y);
      if (this.isMouseDown && keyUnderMouse >= 0) {
        if (this.currentKeyUnderMouse != keyUnderMouse) {
          this.onNoteOff(this.currentKeyUnderMouse);
          this.onNoteOn(keyUnderMouse);
          this.currentKeyUnderMouse = keyUnderMouse;
        }
      } else {
        this.clearCurrentKeyUnderMouse();
      }
    }
  }
  clearCurrentKeyUnderMouse() {
    if (this.currentKeyUnderMouse >= 0) {
      this.onNoteOff(this.currentKeyUnderMouse);
    }
    this.currentKeyUnderMouse = -1;
  }
  getKeyAtPos(x, y) {
    let clickedKey = -1;
    for (let i = 0; i <= 87; i++) {
      let dims = this.renderDimensions.getKeyDimensions(i);
      if (x > dims.x && x < dims.x + dims.w) {
        if (y > dims.y && y < dims.y + dims.h) {
          if (clickedKey == -1) {
            clickedKey = i;
          } else if (isBlack(i) && !isBlack(clickedKey)) {
            clickedKey = i;
            break;
          }
        }
      }
    }
    return clickedKey;
  }
  getCanvasPosFromMouseEvent(ev) {
    let canvHt = Math.max(this.renderDimensions.whiteKeyHeight, this.renderDimensions.blackKeyHeight);
    let yOffset = this.renderDimensions.getAbsolutePianoPosition();
    if (ev.clientX == undefined) {
      if (ev.touches.length) {
        return {
          x: ev.touches[ev.touches.length - 1].clientX,
          y: ev.touches[ev.touches.length - 1].clientY - yOffset,
        };
      } else {
        return { x: -1, y: -1 };
      }
    }
    let x = ev.clientX;
    let y = ev.clientY - yOffset;
    return { x, y };
  }
}
