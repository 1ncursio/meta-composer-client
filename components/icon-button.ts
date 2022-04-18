import { styleStr } from '@utils/aframeUtils';
import { key_grey, key_grey_dark, key_grey_light, key_offwhite } from './vars';

export default AFRAME.registerComponent('gui-icon-button', {
  schema: {
    on: { default: 'click' },
    toggle: { type: 'boolean', default: false },
    toggleState: { type: 'boolean', default: false },
    icon: { type: 'string', default: 'f0f3' },
    iconActive: { type: 'string', default: '' },
    iconFontSize: { type: 'number', default: 0.4 },
    iconFont: { type: 'string', default: 'assets/fonts/fa-solid-900.ttf' },
    fontColor: { type: 'string', default: key_offwhite },
    borderColor: { type: 'string', default: key_offwhite },
    backgroundColor: { type: 'string', default: key_grey },
    backgroundColorOpacity: { type: 'number', default: 0.3 },
    hoverColor: { type: 'string', default: key_grey_dark },
    activeColor: { type: 'string', default: key_grey_light },
  },
  guiItem: null,
  guiInteractable: null,
  iconEntity: null,
  buttonEntity: null,
  toggleState: false,
  init() {
    const data = this.data;
    const el = this.el;
    const guiItem = el.getAttribute('gui-item');
    this.guiItem = guiItem;
    this.toggleState = data.toggle;
    const toggleState = data.toggle;
    const guiInteractable = el.getAttribute('gui-interactable');
    this.guiInteractable = guiInteractable;

    //fallback for old font-sizing
    if (data.iconFontSize > 20) {
      // 150/1000
      const newSize = data.iconFontSize / 750;
      data.iconFontSize = newSize;
    }

    el.setAttribute('geometry', `primitive: plane; height: ${guiItem.height}; width: ${guiItem.width};`);
    el.setAttribute(
      'material',
      `shader: flat; transparent: true; opacity: 0.0; alphaTest: 0.5; side:double; color:${data.backgroundColor};`,
    );

    const buttonContainer = document.createElement('a-entity');
    buttonContainer.setAttribute('geometry', `primitive: cylinder; radius: ${guiItem.height / 2}; height: 0.02;`);
    buttonContainer.setAttribute(
      'material',
      `shader: flat; opacity: ${data.backgroundColorOpacity}; side:double; color: ${data.borderColor}`,
    );
    buttonContainer.setAttribute('rotation', '90 0 0');
    buttonContainer.setAttribute('position', '0 0 0.01');
    // TODO: 없는 게 더 보기 좋아서 일단 주석처리
    // el.appendChild(buttonContainer);

    const buttonEntity = document.createElement('a-entity');
    buttonEntity.setAttribute('geometry', `primitive: cylinder; radius: ${guiItem.height / 2.05}; height: 0.04;`);
    buttonEntity.setAttribute(
      'material',
      `shader: flat; opacity: ${data.backgroundColorOpacity}; side:double; color: ${data.backgroundColor}`,
    );
    buttonEntity.setAttribute('rotation', '90 0 0');
    buttonEntity.setAttribute('position', '0 0 0.02');
    el.appendChild(buttonEntity);
    // @ts-ignore
    this.buttonEntity = buttonEntity;

    this.setIcon(data.icon);

    el.addEventListener('mouseenter', (elem) => {
      buttonEntity.removeAttribute('animation__leave');
      buttonEntity.setAttribute(
        'animation__enter',
        `property: material.color; from: ${data.backgroundColor}; to:${data.hoverColor}; dur:200;`,
      );
    });
    el.addEventListener('mouseleave', (e) => {
      buttonEntity.removeAttribute('animation__click');
      buttonEntity.setAttribute(
        'animation__leave',
        `property: material.color; from: ${data.hoverColor}; to:${data.backgroundColor}; dur:200; easing: easeOutQuad;`,
      );
      buttonEntity.removeAttribute('animation__enter');
    });
    el.addEventListener(data.on, (e) => {
      // if not toggling flashing active state
      buttonEntity.setAttribute(
        'animation__click',
        `property: material.color; from: ${data.activeColor}; to:${data.backgroundColor}; dur:400; easing: easeOutQuad;`,
      );
    });
    ////WAI ARIA Support
    el.setAttribute('role', 'button');
  },
  play() {},
  update(oldData) {
    console.log('In button update, toggle: ' + this.toggleState);
    const data = this.data;
    const el = this.el;

    if (this.iconEntity) {
      console.log('has iconEntity: ' + this.iconEntity);

      const oldEntity = this.iconEntity;
      // @ts-ignore
      oldEntity.parentNode.removeChild(oldEntity);

      this.setIcon(this.data.icon);
    } else {
      console.log('no iconEntity!');
    }
  },
  setActiveState(activeState: boolean) {
    // console.log("in setActiveState function, new state: " + activeState);
    this.data.toggleState = activeState;
    if (!activeState) {
      console.log('not active, about to set background color');
      // @ts-ignore
      this.buttonEntity.setAttribute('material', 'color', this.data.backgroundColor);
    } else {
      console.log('active, about to set active color');
      // @ts-ignore
      this.buttonEntity.setAttribute('material', 'color', this.data.activeColor);
    }
  },
  setIcon(unicode: string) {
    const hex = parseInt(unicode, 16);
    const char = String.fromCharCode(hex);

    const iconEntity = document.createElement('a-entity');
    // @ts-ignore
    this.iconEntity = iconEntity;
    iconEntity.setAttribute(
      'troika-text',
      styleStr({
        value: char,
        align: 'center',
        anchor: 'center',
        baseline: 'center',
        // @ts-ignore
        lineHeight: this.guiItem.height,
        // @ts-ignore
        maxWidth: this.guiItem.width,
        color: this.data.fontColor,
        font: this.data.iconFont,
        fontSize: this.data.iconFontSize,
        depthOffset: 1,
      }),
    );
    iconEntity.setAttribute('position', `0 0 0.05`); // 0.05 y axis adjustment for fontawesome
    //        textEntity.setAttribute('troika-text-material', `shader: flat;`);
    this.el.appendChild(iconEntity);
  },
});
