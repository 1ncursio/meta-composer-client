import { SustainPeriod } from '@lib/midi/Song';
import { getSetting } from '@lib/settings/Settings';

/**
 * Class to render the sustain events in the midi-song. Can fill the sustain periods or draw lines for the individual control-events.
 */
export class SustainRender {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, renderDimensions) {
    this.ctx = ctx;
    this.renderDimensions = renderDimensions;

    this.sustainPeriodFillStyle = 'rgba(0,0,0,0.4)';
    this.sustainOnStrokeStyle = 'rgba(55,155,55,0.6)';
    this.sustainOffStrokeStyle = 'rgba(155,55,55,0.6)';
    this.sustainOnOffFont = '0.6em Arial black';
  }
  render(time, sustainsByChannelAndSecond, sustainPeriods) {
    if (getSetting('showSustainPeriods')) {
      this.renderSustainPeriods(time, sustainPeriods);
    }
    if (getSetting('showSustainOnOffs')) {
      this.renderSustainOnOffs(time, sustainsByChannelAndSecond);
    }
  }
  /**
   * Renders On/Off Sustain Control-Events as lines on screen.
   *
   * @param {Number} time
   * @param {Object} sustainsByChannelAndSecond
   */
  renderSustainOnOffs(time: number, sustainsByChannelAndSecond: Object) {
    let lookBackTime = Math.floor(time - this.renderDimensions.getSecondsDisplayedAfter() - 4);
    let lookAheadTime = Math.ceil(time + this.renderDimensions.getSecondsDisplayedBefore() + 1);
    for (let channel in sustainsByChannelAndSecond) {
      for (let lookUpTime = lookBackTime; lookUpTime < lookAheadTime; lookUpTime++) {
        if (sustainsByChannelAndSecond[channel].hasOwnProperty(lookUpTime)) {
          sustainsByChannelAndSecond[channel][lookUpTime].forEach((sustain) => {
            this.ctx.lineWidth = '1';
            let text = '';
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            let channelStr = getSetting('showSustainChannels') ? '(Channel:  ' + channel + ')' : '';
            if (sustain.isOn) {
              this.ctx.strokeStyle = this.sustainOnStrokeStyle;
              text = 'Sustain On ' + channelStr;
            } else {
              this.ctx.strokeStyle = this.sustainOffStrokeStyle;
              text = 'Sustain Off ' + channelStr;
            }
            let y = this.renderDimensions.getYForTime(sustain.timestamp - time * 1000);
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.renderDimensions.windowWidth, y);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = this.sustainOnOffFont;
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(text, 10, y - 1);
          });
        }
      }
    }
  }
  /**
   * Renders Sustain Periods as rectangles on screen.
   * @param {Number} time
   * @param {Array} sustainPeriods
   */
  renderSustainPeriods(time: number, sustainPeriods: Array<SustainPeriod>) {
    let firstSecondShown = Math.floor(time - this.renderDimensions.getSecondsDisplayedAfter() - 4);
    let lastSecondShown = Math.ceil(time + this.renderDimensions.getSecondsDisplayedBefore() + 1);
    this.ctx.fillStyle = this.sustainPeriodFillStyle;

    sustainPeriods
      .filter(
        (period) =>
          (period.start < lastSecondShown * 1000 && period.start > firstSecondShown * 1000) ||
          (period.start < firstSecondShown * 1000 && (period.end ?? 0) > firstSecondShown * 1000),
      )
      .forEach((period) => {
        let yStart = this.renderDimensions.getYForTime(period.start - time * 1000);
        let yEnd = this.renderDimensions.getYForTime(period.end - time * 1000);

        this.ctx.fillRect(0, yEnd, this.renderDimensions.windowWidth, yStart - yEnd);
      });
  }
}
