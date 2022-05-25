import Player, { START_DELAY } from '@lib/midi/Player';
import { getSetting } from '../settings/Settings';

/**  
 모든 getCurrentSong을 Player.getInstance().song로 바꿨음.
*/

/**
 * Class to render the markers in the midi-song
 */
export class InSongTextRenderer {
  constructor(ctx, renderDimensions) {
    this.ctx = ctx;
    this.renderDimensions = renderDimensions;
  }
  render(time) {
    let c = this.ctx;
    let isReversed = getSetting('reverseNoteDirection');
    let pianoPos = this.renderDimensions.getAbsolutePianoPosition();
    c.fillStyle = 'rgba(255,255,255,0.8)';
    c.strokeStyle = 'rgba(255,255,255,0.8)';
    let fontsize = 40;
    c.font = fontsize + 'px Arial black';

    c.textBaseline = 'top';
    c.lineWidth = 1.5;
    let text = Player.getInstance().song.name;
    let y = this.renderDimensions.getYForTime((START_DELAY * 0.75 - time) * 1000);
    let x = this.renderDimensions.windowWidth / 2;

    let isYAbovePiano = isReversed ? y >= pianoPos : y <= pianoPos;

    //Render Song Name
    if (isYAbovePiano) {
      let txtWd = c.measureText(text).width;
      while (fontsize > 10 && txtWd > this.renderDimensions.windowWidth / 1.6) {
        fontsize--;
        c.font = fontsize + 'px Arial black';
        txtWd = c.measureText(text).width;
      }
      c.fillText(text, x - txtWd / 2, y + 3);
    }
    y += fontsize + 5;
    isYAbovePiano = isReversed ? y >= pianoPos : y <= pianoPos;
    //Render Copyright info
    if (isYAbovePiano) {
      let copyrightText = 'MIDI-File: ©' + Player.getInstance().song?.copyright;
      if (Player.getInstance().song?.copyright) {
        c.fillStyle = 'rgba(255,255,255,0.6)';
        fontsize = 25;
        c.font = '25px Arial black';
        let txtWd = c.measureText(copyrightText).width;
        while (fontsize > 7 && txtWd > this.renderDimensions.windowWidth / 1.4) {
          fontsize--;
          c.font = fontsize + 'px Arial black';
          txtWd = c.measureText(copyrightText).width;
        }
        c.fillText(copyrightText, this.renderDimensions.windowWidth / 2 - txtWd / 2, y + 3);
      }
    }

    //Render Time Signature
    y = this.renderDimensions.getYForTime(-time * 1000) + 10;
    if (y <= this.renderDimensions.getAbsolutePianoPosition()) {
      let timeSig = Player.getInstance().song?.getTimeSignature();
      c.fillStyle = 'rgba(255,255,255,0.6)';
      c.font = '1.5em Arial black';
      let text = ' ';
      if (timeSig) {
        text = ' 𝄞 ' + timeSig.numerator + '/' + timeSig.denominator;
      }
      c.fillText(text, 15, y);
    }
  }
}
