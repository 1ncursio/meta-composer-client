import { Entity } from 'aframe';

/**
 * A button with text
 * @namespace ui
 * @component text-button
 */
export interface ATextButton {
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
  updateButtonState(): void;
  onHover(e: Event | MouseEvent): void;
  onHoverOut(e: Event | MouseEvent): void;
  onClick(e: Event | MouseEvent): void;
  hovering: boolean;
  textEl: Entity | null;
}

// if (!AFRAME.components['text-button']) {
export default AFRAME.registerComponent<ATextButton>('text-button', {
  schema: {
    textHoverColor: { type: 'string' },
    textColor: { type: 'string' },
    backgroundHoverColor: { type: 'string' },
    backgroundColor: { type: 'string' },
  },
  textEl: null,
  hovering: false,
  init() {
    // TODO: This is a bit of a hack to deal with position "component" not setting matrixNeedsUpdate. Come up with a better solution.
    // this.el.object3D.matrixNeedsUpdate = true;
    this.el.object3D.matrixWorldNeedsUpdate = true;
    console.log('registerComponent');
    this.textEl = this.el.querySelector('[text]');

    if (this.el.getObject3D('mesh')) {
      // @ts-ignore
      this.el.components.slice9.material.toneMapped = false;
      console.log('mesh exists');
    } else {
      // @ts-ignore
      this.el.addEventListener(
        'object3dset',
        () => {
          // @ts-ignore
          this.el.components.slice9.material.toneMapped = false;
          console.log('object3dset');
        },
        { once: true },
      );
      console.log('mesh does not exist');
    }
  },
  play() {
    this.updateButtonState();
    this.el.addEventListener('mouseenter', this.onHover.bind(this));
    this.el.addEventListener('click', this.onClick.bind(this));
    this.el.addEventListener('mouseleave', this.onHoverOut.bind(this));
  },

  pause() {
    this.el.removeEventListener('mouseenter', this.onHover.bind(this));
    this.el.removeEventListener('mouseleave', this.onHoverOut.bind(this));
  },

  update() {
    this.updateButtonState();
  },

  updateButtonState() {
    const hovering = this.hovering;
    this.el.setAttribute('slice9', 'color', hovering ? this.data.backgroundHoverColor : this.data.backgroundColor);

    if (this.textEl) {
      // TODO: 이 부분 체크해야 함
      this.textEl.setAttribute('text', 'color', hovering ? this.data.textHoverColor : this.data.textColor);
    }
  },

  onHover(e) {
    this.hovering = true;
    console.log('호버됨');
    this.updateButtonState();
  },
  onHoverOut(e) {
    this.hovering = false;
    console.log('호버나감');
    this.updateButtonState();
  },
  onClick(e) {
    console.log('클릭');
  },
});
// }
