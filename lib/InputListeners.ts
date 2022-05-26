// @ts-nocheck

import Player from './midi/Player';
import { getSetting } from './settings/Settings';
import { getKeyBindings } from './ui/KeyBinder';

export class InputListeners {
  constructor(ui, render) {
    this.grabSpeed = [];
    this.delay = false;

    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    this.addMouseAndTouchListeners(render, ui);

    render.getMainCanvas().addEventListener('wheel', this.onWheel());

    this.addProgressBarMouseListeners(render);

    window.addEventListener('keydown', this.onKeyDown(ui));
    window.addEventListener('keyup', this.onKeyUp());

    ui.fireInitialListeners();

    this.keysPressed = {};

    // let player = Player.getInstance();
    let player = Player.getInstance();
    render.setPianoInputListeners(player.addInputNoteOn.bind(player), player.addInputNoteOff.bind(player));
  }

  addMouseAndTouchListeners(render, ui) {
    window.addEventListener('mouseup', (ev) => this.onMouseUp(ev, render));
    render.getMainCanvas().addEventListener('mousedown', (ev) => this.onMouseDown(ev, render), {
      passive: false,
    });
    render.getMainCanvas().addEventListener('mousemove', (ev) => this.onMouseMove(ev, render, ui), {
      passive: false,
    });
    window.addEventListener('touchend', (ev) => this.onMouseUp(ev, render), {
      passive: false,
    });
    render.getMainCanvas().addEventListener('touchstart', (ev) => this.onMouseDown(ev, render), {
      passive: false,
    });
    render.getMainCanvas().addEventListener('touchmove', (ev) => this.onMouseMove(ev, render, ui), {
      passive: false,
    });
  }

  addProgressBarMouseListeners(render) {
    render.getProgressBarCanvas().addEventListener('mousemove', this.onMouseMoveProgressCanvas(render));
    render.getProgressBarCanvas().addEventListener('mousedown', this.onMouseDownProgressCanvas(render));
  }

  onWheel() {
    return (event) => {
      if (this.delay) {
        return;
      }
      this.delay = true;

      let alreadyScrolling = Player.getInstance().scrolling != 0;

      //Because Firefox does not set .wheelDelta
      let wheelDelta = event.wheelDelta ? event.wheelDelta : -1 * event.deltaY;

      let evDel = ((wheelDelta + 1) / (Math.abs(wheelDelta) + 1)) * Math.min(500, Math.abs(wheelDelta));

      var wheel = (evDel / Math.abs(evDel)) * 500;

      Player.getInstance().scrolling -= 0.001 * wheel;
      if (!alreadyScrolling) {
        Player.getInstance().handleScroll();
      }
      this.delay = false;
    };
  }

  onKeyDown(ui) {
    return (e) => {
      let activeElTagname = document.activeElement.tagName.toLocaleLowerCase();
      let activeElIsSelectOrInput = activeElTagname == 'select' || activeElTagname == 'input';
      if (!Player.getInstance().isFreeplay) {
        if (e.code == 'Space') {
          e.preventDefault();
          if (!Player.getInstance().paused) {
            ui.clickPause(e);
          } else {
            ui.clickPlay(e);
          }
        } else if (e.key == 'ArrowUp' && !activeElIsSelectOrInput) {
          Player.getInstance().increaseSpeed(0.05);
          ui.getSpeedDisplayField().value = Math.floor(Player.getInstance().playbackSpeed * 100) + '%';
        } else if (e.key == 'ArrowDown' && !activeElIsSelectOrInput) {
          Player.getInstance().increaseSpeed(-0.05);
          ui.getSpeedDisplayField().value = Math.floor(Player.getInstance().playbackSpeed * 100) + '%';
        } else if (e.key == 'ArrowLeft' && !activeElIsSelectOrInput) {
          Player.getInstance().skipBack();
        } else if (e.key == 'ArrowRight' && !activeElIsSelectOrInput) {
          Player.getInstance().skipForward();
        } else if (Object.keys(getKeyBindings()).includes(e.key.toUpperCase())) {
          getKeyBindings()[e.key.toUpperCase()].forEach((noteNum) => {
            if (!this.keysPressed[noteNum]) {
              this.keysPressed[noteNum] = true;
              Player.getInstance().addInputNoteOn(noteNum);
            }
          });
        }
      }
    };
  }
  onKeyUp() {
    return (e) => {
      let player = Player.getInstance();
      if (!player.isFreeplay) {
        if (getKeyBindings().hasOwnProperty(e.key.toUpperCase())) {
          getKeyBindings()[e.key.toUpperCase()].forEach((noteNum) => {
            this.keysPressed[noteNum] = false;
            player.addInputNoteOff(noteNum);
          });
        }
      }
    };
  }

  onMouseDownProgressCanvas(render) {
    return (ev) => {
      ev.preventDefault();
      if (ev.target == render.getProgressBarCanvas()) {
        this.grabbedProgressBar = true;
        Player.getInstance().wasPaused = Player.getInstance().paused;
        Player.getInstance().pause();
        let newTime = (ev.clientX / render.renderDimensions.windowWidth) * (Player.getInstance().song.getEnd() / 1000);

        Player.getInstance().setTime(newTime);
      }
    };
  }

  onMouseMoveProgressCanvas(render) {
    return (ev) => {
      if (this.grabbedProgressBar && Player.getInstance().song) {
        let newTime = (ev.clientX / render.renderDimensions.windowWidth) * (Player.getInstance().song.getEnd() / 1000);
        Player.getInstance().setTime(newTime);
      }
    };
  }

  onMouseMove(ev, render, ui) {
    let pos = this.getXYFromMouseEvent(ev);
    if (this.grabbedProgressBar && Player.getInstance().song) {
      let newTime = (ev.clientX / render.renderDimensions.windowWidth) * (Player.getInstance().song.getEnd() / 1000);
      Player.getInstance().setTime(newTime);
      return;
    }

    if (this.grabbedMainCanvas && Player.getInstance().song) {
      if (this.lastYGrabbed) {
        let alreadyScrolling = Player.getInstance().scrolling != 0;
        let yChange = (getSetting('reverseNoteDirection') ? -1 : 1) * (this.lastYGrabbed - pos.y);
        if (!alreadyScrolling) {
          Player.getInstance().setTime(Player.getInstance().getTime() - render.getTimeFromHeight(yChange));
          this.grabSpeed.push(yChange);
          if (this.grabSpeed.length > 3) {
            this.grabSpeed.splice(0, 1);
          }
        }
      }
      this.lastYGrabbed = pos.y;
    }

    render.setMouseCoords(ev.clientX, ev.clientY);

    ui.mouseMoved();
  }

  onMouseDown(ev, render) {
    let pos = this.getXYFromMouseEvent(ev);
    this.lastMouseDownTime = window.performance.now();
    this.lastMouseDownPos = pos;
    if (render.isOnMainCanvas(pos) && !this.grabbedProgressBar) {
      Player.getInstance().wasPaused = Player.getInstance().paused;
      ev.preventDefault();
      this.grabbedMainCanvas = true;
      Player.getInstance().pause();
    }
  }

  onMouseUp(ev, render) {
    let pos = this.getXYFromMouseEvent(ev);
    if (ev.target == document.body && render.isOnMainCanvas(pos)) {
      ev.preventDefault();
    }
    if (this.grabbedMainCanvas && window.performance.now() - this.lastMouseDownTime < 125 && !this.lastYGrabbed) {
      this.grabbedMainCanvas = false;
      let newState = !Player.getInstance().wasPaused;
      newState ? Player.getInstance().pause() : Player.getInstance().resume();
      return;
    }
    if (this.grabSpeed.length) {
      Player.getInstance().scrolling = this.grabSpeed[this.grabSpeed.length - 1] / 50;
      Player.getInstance().handleScroll();
      this.grabSpeed = [];
    }
    if (this.grabbedProgressBar || this.grabbedMainCanvas) {
      if (!Player.getInstance().wasPaused) {
        Player.getInstance().resume();
      }
    }
    this.grabbedProgressBar = false;
    this.grabbedMainCanvas = false;
    this.lastYGrabbed = false;
  }

  getXYFromMouseEvent(ev) {
    if (ev.clientX == undefined) {
      if (ev.touches.length) {
        return {
          x: ev.touches[ev.touches.length - 1].clientX,
          y: ev.touches[ev.touches.length - 1].clientY,
        };
      } else {
        return { x: -1, y: -1 };
      }
    }
    return { x: ev.clientX, y: ev.clientY };
  }
}
