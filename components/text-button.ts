AFRAME.registerComponent<{
  schema: {
    textHoverColor: {
      type: string;
    };
    textColor: {
      type: string;
    };
    backgroundHoverColor: {
      type: string;
    };
    backgroundColor: {
      type: string;
    };
  };
  init(): void;
  play(): void;
  pause(): void;
  update(): void;
  // updateButtonState(): void;
  onHover(): void;
  // onHoverOut(): void;
  hovering: boolean;
  // textEl: Element | null;
}>('text-button', {
  schema: {
    textHoverColor: { type: 'string' },
    textColor: { type: 'string' },
    backgroundHoverColor: { type: 'string' },
    backgroundColor: { type: 'string' },
  },
  init() {
    // TODO: This is a bit of a hack to deal with position "component" not setting matrixNeedsUpdate. Come up with a better solution.
    // this.el.object3D.matrixNeedsUpdate = true;
    this.el.object3D.matrixWorldNeedsUpdate = true;
    // this.onHover = () => {
    // this.hovering = true;
    //   this.updateButtonState();
    // };
    // this.onHoverOut = () => {
    //   this.hovering = false;
    //   this.updateButtonState();
    // };
    // this.textEl = this.el.querySelector('[text]');
  },

  play() {
    // this.updateButtonState();
    // this.el.object3D.addEventListener('hovered', this.onHover);
    // this.el.object3D.addEventListener('unhovered', this.onHoverOut);
  },

  pause() {
    // this.el.object3D.removeEventListener('hovered', this.onHover);
    // this.el.object3D.removeEventListener('unhovered', this.onHoverOut);
  },

  update() {
    // this.updateButtonState();
  },

  // updateButtonState() {
  //   const hovering = this.hovering;
  //   this.el.setAttribute(
  //     'slice9',
  //     'color',
  //     hovering ? this.data.backgroundHoverColor : this.data.backgroundColor,
  //   );

  //   if (this.textEl) {
  //     // TODO: 이 부분 체크해야 함
  //     this.textEl.setAttribute('text', 'color', hovering ? this.data.textHoverColor : this.data.textColor);
  //   }
  // },

  onHover() {
    this.hovering = true;
    // this.updateButtonState();
  },
  hovering: true,

  // onHoverOut() {
  //   this.hovering = false;
  //   this.updateButtonState();
  // },
});
