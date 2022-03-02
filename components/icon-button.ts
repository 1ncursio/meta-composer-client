export interface AIconButton {
  schema: {
    image: {
      type: 'string';
    };
    hoverImage: {
      type: 'string';
    };
    activeImage: {
      type: 'string';
    };
    activeHoverImage: { type: 'string' };
    disabledImage: { type: 'string' };
    active: { type: 'boolean' };
    disabled: { type: 'boolean' };
    tooltip: { type: 'selector' };
    tooltipText: { type: 'string' };
    activeTooltipText: { type: 'string' };
  };
  hovering: boolean;
  updateButtonState(): void;
  onHover(): void;
  onHoverOut(): void;
}

/**
 * A button with an image, tooltip, hover states.
 * @namespace ui
 * @component icon-button
 */
export default AFRAME.registerComponent<AIconButton>('icon-button', {
  schema: {
    image: { type: 'string' },
    hoverImage: { type: 'string' },
    activeImage: { type: 'string' },
    activeHoverImage: { type: 'string' },
    disabledImage: { type: 'string' },
    active: { type: 'boolean' },
    disabled: { type: 'boolean' },
    tooltip: { type: 'selector' },
    tooltipText: { type: 'string' },
    activeTooltipText: { type: 'string' },
  },
  hovering: false,
  init() {
    this.el.object3D.matrixWorldNeedsUpdate = true;
  },

  play() {
    this.updateButtonState();
    this.el.object3D.addEventListener('hovered', this.onHover);
    this.el.object3D.addEventListener('unhovered', this.onHoverOut);
  },

  pause() {
    this.el.object3D.removeEventListener('hovered', this.onHover);
    this.el.object3D.removeEventListener('unhovered', this.onHoverOut);
  },

  update() {
    this.updateButtonState();
  },

  updateButtonState() {
    const hovering = this.hovering;
    const active: boolean = this.data.active;
    const disabled: boolean = this.data.disabled;

    let image;
    if (disabled) {
      image = 'disabledImage';
    } else if (active) {
      image = hovering ? 'activeHoverImage' : 'activeImage';
    } else {
      image = hovering ? 'hoverImage' : 'image';
    }

    if (this.el.components.sprite) {
      if (this.data[image]) {
        this.el.setAttribute('sprite', 'name', this.data[image]);
      } else {
        console.warn(`No ${image} image on me.`, this);
      }
    } else {
      console.error('No sprite.');
    }

    if (this.data.tooltip && hovering) {
      const tooltipText =
        (this.data.active ? this.data.activeTooltipText : this.data.tooltipText) + (disabled ? ' Disabled' : '');
      this.data.tooltip.querySelector('[text]').setAttribute('text', 'value', tooltipText);
    }
  },
  onHover() {
    this.hovering = true;
    if (this.data.tooltip) {
      this.data.tooltip.object3D.visible = true;
    }
    this.updateButtonState();
  },
  onHoverOut() {
    this.hovering = false;
    if (this.data.tooltip) {
      this.data.tooltip.object3D.visible = false;
    }
    this.updateButtonState();
  },
});
