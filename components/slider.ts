import { coordStr, styleStr } from '@utils/aframeUtils';
import { Entity } from 'aframe';
import { key_grey, key_grey_light, key_offwhite, key_orange } from './vars';

export interface AGUISlider {
  schema: {
    activeColor: { type: 'string'; default: string };
    backgroundColor: { type: 'string'; default: string };
    backgroundOpacity: { type: 'number'; default: 0.1 };
    borderColor: { type: 'string'; default: string };
    handleColor: { type: 'string'; default: string };
    handleInnerDepth: { type: 'number'; default: number };
    handleInnerRadius: { type: 'number'; default: number };
    handleOuterDepth: { type: 'number'; default: number };
    handleOuterRadius: { type: 'number'; default: number };
    hoverColor: { type: 'string'; default: string };
    leftRightPadding: { type: 'number'; default: number };
    percent: { type: 'number'; default: number };
    sliderBarHeight: { type: 'number'; default: number };
    sliderBarDepth: { type: 'number'; default: number };
    topBottomPadding: { type: 'number'; default: number };
  };
  sliderActiveBar: Entity | null;
  sliderBar: Entity | null;
  handleContainer: Entity | null;
  sliderBarWidth: number;
  onClick: (e: Event) => void;
}

export default AFRAME.registerComponent<AGUISlider>('gui-slider', {
  schema: {
    activeColor: { type: 'string', default: key_orange },
    backgroundColor: { type: 'string', default: key_offwhite },
    borderColor: { type: 'string', default: key_grey },
    handleColor: { type: 'string', default: '#f59f0a' },
    handleInnerDepth: { type: 'number', default: 0.02 },
    handleInnerRadius: { type: 'number', default: 0.13 },
    handleOuterDepth: { type: 'number', default: 0.04 },
    handleOuterRadius: { type: 'number', default: 0.17 },
    hoverColor: { type: 'string', default: key_grey_light },
    leftRightPadding: { type: 'number', default: 0.25 },
    percent: { type: 'number', default: 0.5 },
    sliderBarHeight: { type: 'number', default: 0.05 },
    sliderBarDepth: { type: 'number', default: 0.03 },
    topBottomPadding: { type: 'number', default: 0.125 },
  },
  sliderActiveBar: null,
  sliderBar: null,
  handleContainer: null,
  sliderBarWidth: 0,
  init() {
    const data = this.data;
    const el = this.el;
    const guiItem = el.getAttribute('gui-item');
    const sliderWidth = guiItem.width - data.leftRightPadding * 2.0;
    this.sliderBarWidth = sliderWidth;
    console.log({ sliderWidth });
    // const sliderHeight = guiItem.height - data.topBottomPadding * 2.0;

    el.setAttribute(
      'geometry',
      styleStr({
        primitive: 'plane',
        width: guiItem.width,
        height: guiItem.height,
      }),
    );
    el.setAttribute(
      'material',
      styleStr({
        shader: 'flat',
        color: data.backgroundColor,
        opacity: data.backgroundOpacity,
        side: 'front',
      }),
    );

    /* 슬라이더 액티브 바 */
    const sliderActiveBar = document.createElement('a-entity');
    sliderActiveBar.setAttribute(
      'geometry',
      styleStr({
        primitive: 'box',
        width: data.percent * sliderWidth,
        height: data.sliderBarHeight,
        depth: data.sliderBarDepth,
      }),
    );
    sliderActiveBar.setAttribute(
      'material',
      styleStr({
        shader: 'flat',
        opacity: 1,
        side: 'double',
        color: data.activeColor,
      }),
    );
    sliderActiveBar.setAttribute(
      'position',
      coordStr({
        x: (data.percent * sliderWidth - sliderWidth) * 0.5,
        y: 0,
        z: data.sliderBarDepth - 0.01,
      }),
    );
    el.appendChild(sliderActiveBar);

    this.sliderActiveBar = sliderActiveBar;

    /* 슬라이더 바 */
    const sliderBar = document.createElement('a-entity');
    sliderBar.setAttribute(
      'geometry',
      styleStr({
        primitive: 'box',
        width: sliderWidth - data.percent * sliderWidth,
        height: data.sliderBarHeight,
        depth: data.sliderBarDepth,
      }),
    );
    sliderBar.setAttribute(
      'material',
      styleStr({
        shader: 'flat',
        opacity: 1,
        side: 'double',
        color: data.borderColor,
      }),
    );
    sliderBar.setAttribute(
      'position',
      coordStr({
        x: data.percent * sliderWidth * 0.5,
        y: 0,
        z: data.sliderBarDepth - 0.01,
      }),
    );
    el.appendChild(sliderBar);

    this.sliderBar = sliderBar;

    /* 핸들 컨테이너 */
    const handleContainer = document.createElement('a-entity');
    handleContainer.setAttribute(
      'geometry',
      styleStr({
        primitive: 'cylinder',
        radius: data.handleOuterRadius,
        height: data.handleOuterDepth,
      }),
    );
    handleContainer.setAttribute(
      'material',
      styleStr({
        shader: 'flat',
        opacity: 1,
        side: 'double',
        color: data.borderColor,
      }),
    );
    handleContainer.setAttribute(
      'rotation',
      coordStr({
        x: 90,
        y: 0,
        z: 0,
      }),
    );
    handleContainer.setAttribute(
      'position',
      coordStr({
        x: data.percent * sliderWidth - sliderWidth * 0.5,
        y: 0,
        z: data.handleOuterDepth - 0.01,
      }),
    );
    el.appendChild(handleContainer);

    /* 핸들 */
    const handle = document.createElement('a-entity');
    handle.setAttribute(
      'geometry',
      `primitive: cylinder; radius: ${data.handleInnerRadius}; height: ${data.handleInnerDepth};`,
    );
    handle.setAttribute(
      'material',
      styleStr({
        shader: 'flat',
        opacity: 1,
        side: 'double',
        color: data.handleColor,
      }),
    );
    handle.setAttribute(
      'position',
      coordStr({
        x: 0,
        y: data.handleInnerDepth,
        z: 0,
      }),
    );
    handleContainer.appendChild(handle);

    this.handleContainer = handleContainer;

    /* 이벤트 핸들러 */
    el.addEventListener('mouseenter', () => {
      handle.setAttribute('material', 'color', data.hoverColor);
      sliderActiveBar.setAttribute('material', 'color', data.hoverColor);
    });

    el.addEventListener('mouseleave', () => {
      handle.setAttribute('material', 'color', data.handleColor);
      sliderActiveBar.setAttribute('material', 'color', data.handleColor);
    });

    el.addEventListener('click', this.onClick.bind(this));
  },
  update() {},
  tick() {},
  remove() {},
  pause() {},
  play() {},
  onClick(e) {
    console.log('I was clicked at: ', e.detail.intersection.point);
    const localCoordinates = this.el.object3D.worldToLocal(e.detail.intersection.point);
    console.log('local coordinates: ', localCoordinates);
    console.log('current percent: ' + this.data.percent);
    const sliderBarWidth = this.sliderBarWidth; // total width of slider bar
    if (localCoordinates.x <= -sliderBarWidth / 2) {
      this.data.percent = 0;
    } else if (localCoordinates.x >= sliderBarWidth / 2) {
      this.data.percent = 1.0;
    } else {
      this.data.percent = (localCoordinates.x + sliderBarWidth / 2) / sliderBarWidth;
    }

    /* 슬라이더 액티브 바 */
    this.sliderActiveBar!.setAttribute(
      'geometry',
      styleStr({
        primitive: 'box',
        // width: this.data.percent * 2,
        width: this.data.percent * sliderBarWidth,
        height: this.data.sliderBarHeight,
        depth: 0.03,
      }),
    );

    this.sliderActiveBar!.setAttribute(
      'position',
      coordStr({
        x: (this.data.percent * sliderBarWidth - sliderBarWidth) * 0.5,
        y: 0,
        z: 0.02,
      }),
    );

    /* 슬라이더 바 */
    this.sliderBar!.setAttribute(
      'geometry',
      styleStr({
        primitive: 'box',
        // width: 2 - this.data.percent * 2,
        width: sliderBarWidth - this.data.percent * sliderBarWidth,
        height: this.data.sliderBarHeight,
        depth: 0.03,
      }),
    );
    this.sliderBar!.setAttribute(
      'position',
      coordStr({
        // x: this.data.percent,
        x: this.data.percent * sliderBarWidth * 0.5,
        y: 0,
        z: 0.02,
      }),
    );

    /* 핸들 컨테이너 */
    this.handleContainer!.setAttribute(
      'position',
      coordStr({
        // x: this.data.percent * 2 - 1,
        x: this.data.percent * sliderBarWidth - sliderBarWidth * 0.5,
        y: 0,
        z: 0.03,
      }),
    );

    const guiInteractable = this.el.getAttribute('gui-interactable');
    console.log('guiInteractable: ', guiInteractable);
    // type EventFunction = typeof ONCLICK_HANDLER;
    // const clickActionFunctionName: EventFunction = guiInteractable.clickAction;
    // console.log('clickActionFunctionName: ' + clickActionFunctionName);
    // find object
    // const clickActionFunction = window[clickActionFunctionName];
    //console.log("clickActionFunction: "+clickActionFunction);
    // is object a function?
    // if (typeof clickActionFunction === 'function') clickActionFunction(e, data.percent);

    // useStore.getState().xr[clickActionFunctionName]();
  },
});
