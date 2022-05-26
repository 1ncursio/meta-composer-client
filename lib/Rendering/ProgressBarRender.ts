// @ts-nocheck

import { RenderDimensions } from '@lib/midi/RenderDimensions';
import { PROGRESS_BAR_CANVAS_HEIGHT } from '@lib/midi/RenderV2';
import { drawRoundRect, formatTime, getCssVariable } from '@utils/util';
import { addDynamicSettingsToObj, getSetting } from '../settings/Settings';
/**
 * Renders the progress bar of the song
 */
export class ProgressBarRender {
  ctx: CanvasRenderingContext2D;
  renderDimensions: RenderDimensions;

  constructor(ctx: CanvasRenderingContext2D, renderDimensions: RenderDimensions) {
    this.ctx = ctx;
    this.ctx.canvas.addEventListener(
      'mousemove',
      function (ev) {
        this.mouseX = ev.clientX;
      }.bind(this),
    );
    this.ctx.canvas.addEventListener(
      'mouseleave',
      function (ev) {
        this.mouseX = -1000;
      }.bind(this),
    );
    this.renderDimensions = renderDimensions;
    this.gradient = this.ctx.createLinearGradient(
      this.renderDimensions.windowWidth / 2,
      0,
      this.renderDimensions.windowWidth / 2,
      PROGRESS_BAR_CANVAS_HEIGHT,
    );

    this.gradient = this.ctx.createLinearGradient(
      this.renderDimensions.windowWidth / 2,
      0,
      this.renderDimensions.windowWidth / 2,
      PROGRESS_BAR_CANVAS_HEIGHT,
    );

    this.darkInnerMenuBgColor = getCssVariable('darkInnerMenuBgColor');
    this.inputBgColor = getCssVariable('inputBgColor');
    this.inputBgColor = getCssVariable('inputBgColor');
    this.progressBarGreen = getCssVariable('progressBarGreen');
    this.progressBarHeight = getCssVariable('progressBarHeight');
    let settingIds = ['showMiliseconds', 'showMarkersTimeline'];
    addDynamicSettingsToObj(settingIds, this, '_');

    this.gradient.addColorStop(0, 'transparent');
    this.gradient.addColorStop(0.05, this.darkInnerMenuBgColor);
    this.gradient.addColorStop(0.1, this.inputBgColor);
    this.gradient.addColorStop(0.9, this.inputBgColor);

    this.gradient.addColorStop(0.95, this.darkInnerMenuBgColor);
    this.gradient.addColorStop(1, 'transparent');
  }

  render(time, end, markers) {
    this.ctx.clearRect(0, 0, this.renderDimensions.windowWidth, PROGRESS_BAR_CANVAS_HEIGHT);
    let ctx = this.ctx;

    let progressPercent = Math.max(0, time / (end / 1000));

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = this.gradient;

    ctx.fillRect(0, 0, this.renderDimensions.windowWidth, PROGRESS_BAR_CANVAS_HEIGHT);
    ctx.globalAlpha = 1;
    // ctx.filter = "blur(5px)"

    ctx.fillStyle = this.progressBarGreen;
    let barHt = parseInt(this.progressBarHeight);
    let margin = PROGRESS_BAR_CANVAS_HEIGHT - barHt;
    drawRoundRect(
      ctx,
      margin / 2,
      margin / 2,
      (this.renderDimensions.windowWidth - margin) * Math.min(1, progressPercent),
      barHt,
      barHt / 4,
      true,
    );
    ctx.fill();
    // ctx.filter = "none"

    this.renderMarkersAndTime(time, markers, end);
  }

  renderMarkersAndTime(time: number, markers, end: number) {
    let ctx = this.ctx;
    ctx.font = '14px Arial black';
    let showMilis = this._showMiliseconds;
    let text = formatTime(Math.min(time, end), showMilis) + ' / ' + formatTime(end / 1000, showMilis);
    let wd = ctx.measureText(text).width;
    let x = this.renderDimensions.windowWidth / 2 - wd / 2;
    let y = PROGRESS_BAR_CANVAS_HEIGHT / 2 + 5;
    let isShowingAMarker = false;
    if (this._showMarkersTimeline) {
      ctx.lineCap = 'round';
      markers.forEach((marker) => {
        let xPos = (marker.timestamp / end) * this.renderDimensions.windowWidth;
        if (Math.abs(xPos - this.mouseX) < 10) {
          let txtWd = ctx.measureText(marker.text).width;
          if (x - 3 - txtWd / 2 < xPos && x + wd + 3 + txtWd / 2 > xPos) {
            isShowingAMarker = true;
          }
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillText(
            marker.text,
            Math.max(5, Math.min(this.renderDimensions.windowWidth - txtWd - 5, xPos - txtWd / 2)),
            y,
          );
        } else {
          let ht = 3;
          let lgr = ctx.createLinearGradient(xPos, PROGRESS_BAR_CANVAS_HEIGHT, xPos, PROGRESS_BAR_CANVAS_HEIGHT - ht);
          lgr.addColorStop(0, 'rgba(0,0,0,0)');
          lgr.addColorStop(0.2, 'rgba(0,0,0,0.1)');
          lgr.addColorStop(1, 'rgba(0,0,0,0.6)');
          ctx.strokeStyle = lgr;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(xPos, PROGRESS_BAR_CANVAS_HEIGHT);
          ctx.lineTo(xPos, PROGRESS_BAR_CANVAS_HEIGHT - ht);

          ctx.stroke();
          ctx.closePath();
        }
      });
    }
    if (!isShowingAMarker) {
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillText(text, x, y);
    }
  }
}
