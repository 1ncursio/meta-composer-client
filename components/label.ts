import { styleStr } from '@utils/aframeUtils';
import { key_grey_dark, key_offwhite } from './vars';

export default AFRAME.registerComponent('gui-label', {
  schema: {
    value: { type: 'string', default: '' },
    align: { type: 'string', default: 'center' },
    anchor: { type: 'string', default: 'center' },
    fontSize: { type: 'number', default: 0.2 },
    lineHeight: { type: 'number', default: 0.2 },
    letterSpacing: { type: 'number', default: 0 },
    fontFamily: { type: 'string', default: '' },
    fontColor: { type: 'string', default: key_grey_dark },
    backgroundColor: { type: 'string', default: key_offwhite },
    opacity: { type: 'number', default: 1.0 },
    textDepth: { type: 'number', default: 0.01 },
  },
  init() {
    const data = this.data;
    const el = this.el;
    const guiItem = el.getAttribute('gui-item');
    // @ts-ignore
    this.guiItem = guiItem;

    el.setAttribute('geometry', `primitive: plane; height: ${guiItem.height}; width: ${guiItem.width};`);
    el.setAttribute(
      'material',
      `shader: flat; side:front; color:${data.backgroundColor}; transparent: true; opacity: ${data.opacity}; alphaTest: 0.5;`,
    );

    //fallback for old font-sizing
    if (data.fontSize > 20) {
      // 150/750
      const newSize = data.fontSize / 750;
      data.fontSize = newSize;
    }

    this.setText(data.value);

    ////WAI ARIA Support

    // if(data.labelFor){
    //   // el.setAttribute('role', 'button');
    // }
  },
  update(oldData) {
    // @ts-ignore
    if (this.textEntity) {
      // @ts-ignore
      console.log('has textEntity: ' + this.textEntity);

      // @ts-ignore
      const oldEntity = this.textEntity;
      oldEntity.parentNode.removeChild(oldEntity);

      this.setText(this.data.value);
    } else {
      console.log('no textEntity!');
    }
  },
  setText(newText: string) {
    const textEntity = document.createElement('a-entity');
    // @ts-ignore
    this.textEntity = textEntity;
    textEntity.setAttribute(
      'troika-text',
      styleStr({
        value: newText,
        align: this.data.align,
        anchor: this.data.anchor,
        baseline: 'center',
        letterSpacing: 0,
        lineHeight: this.data.lineHeight,
        color: this.data.fontColor,
        font: this.data.fontFamily,
        fontSize: this.data.fontSize,
        depthOffset: 1,
        // @ts-ignore
        maxWidth: this.guiItem.width / 1.05,
      }),
    );

    textEntity.setAttribute('position', `0 0 ${this.data.textDepth}`);
    // textEntity.setAttribute('troika-text-material', `shader: flat;`);
    this.el.appendChild(textEntity);
  },
});
