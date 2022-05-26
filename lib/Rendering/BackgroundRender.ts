// @ts-nocheck

import { RenderDimensions } from '@lib/midi/RenderDimensions';
import { isBlack } from '@utils/util';
import { addDynamicSettingsToObj, getSetting, setSettingCallback } from '../settings/Settings';
/**
 * Class that renders the background of the main canvas
 */
export class BackgroundRender {
  ctx: CanvasRenderingContext2D;
  renderDimensions: RenderDimensions;

  constructor(ctx: CanvasRenderingContext2D, renderDimensions: RenderDimensions) {
    this.ctx = ctx;
    this.renderDimensions = renderDimensions;
    this.renderDimensions.registerResizeCallback(this.render.bind(this));
    setSettingCallback('pianoPositionOnce', this.render.bind(this));
    let settings = [
      'bgCol1',
      'bgCol2',
      'bgCol3',
      'bgCol4',
      'pianoPosition',
      'reverseNoteDirection',
      'extendBgPastPiano',
    ];
    addDynamicSettingsToObj(settings, this);
    settings.forEach((setting) => {
      setSettingCallback(setting, this.render.bind(this));
    });
    this.render();
  }

  renderIfColorsChanged() {
    // if (
    // 	this.bgCol1 != getSetting("bgCol1") ||
    // 	this.bgCol2 != getSetting("bgCol2") ||
    // 	this.bgCol3 != getSetting("bgCol3") ||
    // 	this.bgCol4 != getSetting("bgCol4") ||
    // 	this.pianoPosition != getSetting("pianoPosition") ||
    // 	this.reverseNoteDirection != getSetting("reverseNoteDirection") ||
    // 	this.extendBgPastPiano != getSetting("extendBgPastPiano")
    // ) {
    // 	this.render()
    // }
  }

  render() {
    let c = this.ctx;
    c.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);

    let reversed = this.reverseNoteDirection;
    let extendPastPiano = this.extendBgPastPiano;

    let bgHeight = extendPastPiano
      ? this.renderDimensions.windowHeight
      : this.renderDimensions.getAbsolutePianoPosition();
    let bgY = 0;

    if (reversed && !extendPastPiano) {
      bgHeight = this.renderDimensions.windowHeight - this.renderDimensions.getAbsolutePianoPosition();
      bgY = this.renderDimensions.getAbsolutePianoPosition();
    }

    extendPastPiano
      ? this.renderDimensions.windowHeight
      : reversed
      ? this.renderDimensions.windowHeight - this.renderDimensions.getAbsolutePianoPosition()
      : this.renderDimensions.getAbsolutePianoPosition();
    extendPastPiano ? 0 : reversed ? this.renderDimensions.getAbsolutePianoPosition() : 0;
    const col1 = this.bgCol1;
    const col2 = this.bgCol2;
    const col3 = this.bgCol3;
    const col4 = this.bgCol4;
    c.strokeStyle = col1;
    c.fillStyle = col2;
    let whiteKey = 0;
    for (let i = 0; i < 88; i++) {
      if (!isBlack(i)) {
        c.strokeStyle = col3;
        c.fillStyle = (i + 2) % 2 ? col1 : col2;
        c.lineWidth = 1;

        let dim = this.renderDimensions.getKeyDimensions(i);
        c.fillRect(Math.floor(dim.x), bgY, Math.ceil(dim.w), bgHeight);

        if (1 + (whiteKey % 7) == 3) {
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(dim.x, bgY);
          c.lineTo(dim.x, bgY + bgHeight);
          c.stroke();
          c.closePath();
        } else {
          c.strokeStyle = col4;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(dim.x, bgY);
          c.lineTo(dim.x, bgY + bgHeight);
          c.stroke();
          c.closePath();
        }
        whiteKey++;
      }
    }
    this.pianoPosition = getSetting('pianoPosition');
  }
}
