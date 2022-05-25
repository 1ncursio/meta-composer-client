import { RenderDimensions } from '@lib/midi/RenderDimensions.js';
import { DomHelper } from './DomHelper.js';

export class ZoomUI {
  renderDimensions: RenderDimensions;
  constructor(renderDimensions: RenderDimensions) {
    this.contentDiv = null;
    this.renderDimensions = renderDimensions;
  }
  setTop(y) {
    if (this.contentDiv) {
      this.contentDiv.style.top = y + 'px';
    }
  }
  getContentDiv() {
    if (this.contentDiv) {
      return this.contentDiv;
    }
    let cont = DomHelper.createDivWithClass('zoomGroup btn-group');
    this.contentDiv = cont;
    const zoomInBtn = DomHelper.createGlyphiconButton('zoomInButton', 'zoom-in', () => this.renderDimensions.zoomIn());
    //zoomIn
    cont.appendChild(zoomInBtn);
    zoomInBtn.classList.add('zoomBtn');
    zoomInBtn.classList.add('hidden');

    const zoomOutBtn = DomHelper.createGlyphiconButton('zoomOutButton', 'zoom-out', () =>
      this.renderDimensions.zoomOut(),
    );
    //zoomOut
    cont.appendChild(zoomOutBtn);
    zoomOutBtn.classList.add('zoomBtn');
    zoomOutBtn.classList.add('hidden');

    const moveLeftBtn = DomHelper.createGlyphiconButton('moveViewLeftButton', 'arrow-left', () =>
      this.renderDimensions.moveViewLeft(),
    );
    //moveLeft
    cont.appendChild(moveLeftBtn);
    moveLeftBtn.classList.add('zoomBtn');
    moveLeftBtn.classList.add('hidden');

    const moveRightBtn = DomHelper.createGlyphiconButton('moveViewLeftButton', 'arrow-right', () =>
      this.renderDimensions.moveViewRight(),
    );
    //moveRight
    cont.appendChild(moveRightBtn);
    moveRightBtn.classList.add('zoomBtn');
    moveRightBtn.classList.add('hidden');

    const fitSongButton = DomHelper.createGlyphiconButton('fitSongButton', 'resize-small', () =>
      this.renderDimensions.fitSong(Player.getInstance().song?.getNoteRange()),
    );
    fitSongButton.classList.add('zoomBtn');
    fitSongButton.classList.add('hidden');

    //FitSong
    cont.appendChild(fitSongButton);
    const showAllBtn = DomHelper.createGlyphiconButton('showAllButton', 'resize-full', () =>
      this.renderDimensions.showAll(),
    );
    showAllBtn.classList.add('zoomBtn');
    showAllBtn.classList.add('hidden');

    //ShowAll
    cont.appendChild(showAllBtn);

    let collapsed = true;
    const collapseAllBtn = DomHelper.createGlyphiconButton('fitSongButton', 'chevron-down', () => {
      if (collapsed) {
        collapsed = false;
        cont.querySelectorAll('.zoomBtn').forEach((el) => el.classList.remove('hidden'));
        // cont.style.height = "600px"
        DomHelper.replaceGlyph(collapseAllBtn, 'chevron-down', 'chevron-up');
      } else {
        collapsed = true;
        DomHelper.replaceGlyph(collapseAllBtn, 'chevron-up', 'chevron-down');
        cont.querySelectorAll('.zoomBtn').forEach((el) => (collapseAllBtn != el ? el.classList.add('hidden') : null));

        // cont.style.height = "60px"
      }
    });
    collapseAllBtn.classList.add('zoomBtn');
    cont.appendChild(collapseAllBtn);

    return cont;
  }
}
