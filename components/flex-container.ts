// @ts-nocheck

/*  //trying to figure out global styles that customize gui items
const styles = StyleSheet.create({
    fontFamily: {
        type: 'string',
        default: 'Helvetica'
    },
    fontColor: {
        type: 'string',
        default: key_offwhite
    },
    borderColor: {
        type: 'string',
        default: key_offwhite
    },
    backgroundColor: {
        type: 'string',
        default: key_grey
    },
    hoverColor: {
        type: 'string',
        default: key_grey_dark
    },
    activeColor: {
        type: 'string',
        default: key_orange
    },
    handleColor: {
        type: 'string',
        default: key_offwhite
    },
});
*/

import { coordStr, styleStr } from '@utils/aframeUtils';
import { Entity } from 'aframe';
import { Vector3 } from 'three';
import { key_grey, key_grey_dark, key_offwhite, key_orange } from './vars';

const onAppendChildToContainer = (elem: Node, f: (containerElement: Node, addedChildren: NodeList) => void) => {
  // console.log("in onAppend, elem: "+elem);
  const observer = new MutationObserver((mutations, me) => {
    //console.log("in mutationObserver, me: "+me);
    mutations.forEach((m) => {
      console.log(m);
      if (m.addedNodes.length) {
        f(m.target, m.addedNodes);
      }
    });
  });
  observer.observe(elem, { childList: true });
};

export default AFRAME.registerComponent('gui-flex-container', {
  schema: {
    flexDirection: { type: 'string', default: 'row' },
    justifyContent: { type: 'string', default: 'flexStart' },
    alignItems: { type: 'string', default: 'flexStart' },
    itemPadding: { type: 'number', default: 0.0 },
    opacity: { type: 'number', default: 0.0 },
    isTopContainer: { type: 'boolean', default: false },
    panelColor: { type: 'string', default: key_grey },
    panelRounded: { type: 'number', default: 0.05 },
    visible: { type: 'boolean', default: true },

    //global settings for GUI items
    styles: {
      fontFamily: { type: 'string', default: 'Helvetica' },
      fontColor: { type: 'string', default: key_offwhite },
      borderColor: { type: 'string', default: key_offwhite },
      backgroundColor: { type: 'string', default: key_grey },
      hoverColor: { type: 'string', default: key_grey_dark },
      activeColor: { type: 'string', default: key_orange },
      handleColor: { type: 'string', default: key_offwhite },
    },
  },
  panelBackground: null as Entity | null,
  init() {
    console.log('in aframe-gui-component init for: ' + this.el.getAttribute('id'));
    const containerGuiItem = this.el.getAttribute('gui-item');

    if (this.data.isTopContainer) {
      this.setBackground();
    } else {
      //          this.el.setAttribute('material', `shader: flat; transparent: true; alphaTest: 0.5; side:front;`);
      this.el.setAttribute(
        'rounded',
        styleStr({
          height: containerGuiItem.height,
          width: containerGuiItem.width,
          opacity: this.data.opacity,
          color: this.data.panelColor,
          radius: this.data.panelRounded,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 1,
        }),
      );
    }

    // TODO: 이전 버전에서는 작동하는 거 같은데, 작동안하면 다른 방법 찾아야 함
    // @ts-ignore
    this.children = this.el.getChildEntities();
    console.log('children: ' + this.children);
    // this.el.children
    //console.log("childElements: "+this.children);
    //console.log("num child Elements: "+this.children.length);

    // coordinate system is 0, 0 in the top left
    let cursorX = 0;
    let cursorY = 0;
    if (this.data.flexDirection == 'row') {
      // first figure out cursor position on main X axis
      if (this.data.justifyContent == 'flexStart') {
        cursorX = 0;
      } else if (this.data.justifyContent == 'center' || this.data.justifyContent == 'flexEnd') {
        let rowWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
          const childElement = this.children[i];
          const childGuiItem = childElement.getAttribute('gui-item');
          rowWidth = rowWidth + childGuiItem.margin.w + childGuiItem.width + childGuiItem.margin.y;
        }
        if (this.data.justifyContent == 'center') {
          cursorX = (containerGuiItem.width - rowWidth) * 0.5;
        } else if (this.data.justifyContent == 'flexEnd') {
          cursorX = containerGuiItem.width - rowWidth;
        }
      }
      // then figure out baseline / cursor position on cross Y axis
      if (this.data.alignItems == 'center') {
        cursorY = containerGuiItem.height; // baseline is center
      } else if (this.data.alignItems == 'flexStart') {
        cursorY = 0; // baseline is top of container
      } else if (this.data.alignItems == 'flexEnd') {
        cursorY = containerGuiItem.height; // baseline is bottom of container
      }
    } else if (this.data.flexDirection == 'column') {
      // first figure out cursor position on main Y axis
      if (this.data.justifyContent == 'flexStart') {
        cursorY = 0;
      } else if (this.data.justifyContent == 'center' || this.data.justifyContent == 'flexEnd') {
        let columnHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
          const childElement = this.children[i];
          //console.log("childElement: "+childElement);
          const childGuiItem = childElement.getAttribute('gui-item');
          //console.log("childGuiItem: "+childGuiItem);
          columnHeight = columnHeight + childGuiItem.margin.x + childGuiItem.height + childGuiItem.margin.z;
        }
        if (this.data.justifyContent == 'center') {
          cursorY = (containerGuiItem.height - columnHeight) * 0.5;
        } else if (this.data.justifyContent == 'flexEnd') {
          cursorY = containerGuiItem.height - columnHeight;
        }
      }
      // then figure out baseline / cursor position on cross X axis
      if (this.data.alignItems == 'flexStart') {
        cursorX = 0; // baseline is left
      } else if (this.data.alignItems == 'center') {
        cursorX = containerGuiItem.width * 0.5; // baseline is center
      } else if (this.data.alignItems == 'flexEnd') {
        cursorX = 0; // baseline is right
      }
    }
    //console.log(`initial cursor position for ${this.el.getAttribute("id")}: ${cursorX} ${cursorY} 0.01`)

    // not that cursor positions are determined, loop through and lay out items
    let wrapOffsetX = 0; // not used yet since wrapping isn't supported
    let wrapOffsetY = 0; // not used yet since wrapping isn't supported
    for (let i = 0; i < this.children.length; i++) {
      const childElement = this.children[i];
      // TODO: change this to call gedWidth() and setWidth() of component
      let childPositionX = 0;
      let childPositionY = 0;
      let childPositionZ = 0.01;
      const childGuiItem = childElement.getAttribute('gui-item');

      // now get object position in aframe container cordinates (0, 0 is center)
      if (childGuiItem) {
        if (this.data.flexDirection == 'row') {
          if (this.data.alignItems == 'center') {
            childPositionY = 0; // child position is always 0 for center vertical alignment
          } else if (this.data.alignItems == 'flexStart') {
            childPositionY = containerGuiItem.height * 0.5 - childGuiItem.margin.x - childGuiItem.height;
          } else if (this.data.alignItems == 'flexEnd') {
            childPositionY = -containerGuiItem.height * 0.5 + childGuiItem.margin.z + childGuiItem.height;
          }
          childPositionX = -containerGuiItem.width * 0.5 + cursorX + childGuiItem.margin.w + childGuiItem.width * 0.5;
          cursorX = cursorX + childGuiItem.margin.w + childGuiItem.width + childGuiItem.margin.y;
        } else if (this.data.flexDirection == 'column') {
          if (this.data.alignItems == 'center') {
            childPositionX = 0; // child position is always 0 to center
          } else if (this.data.alignItems == 'flexStart') {
            childPositionX = -containerGuiItem.width * 0.5 + childGuiItem.margin.w + childGuiItem.width * 0.5;
          } else if (this.data.alignItems == 'flexEnd') {
            childPositionX = containerGuiItem.width * 0.5 - childGuiItem.margin.y - childGuiItem.width * 0.5;
          }
          childPositionY = containerGuiItem.height * 0.5 - cursorY - -childGuiItem.margin.x - childGuiItem.height * 0.5;
          cursorY = cursorY + childGuiItem.margin.x + childGuiItem.height + childGuiItem.margin.z;
        }
        //console.log(`child element position for ${childElement.id}: ${childPositionX} ${childPositionY} ${childPositionZ}`)
        childElement.setAttribute('position', `${childPositionX} ${childPositionY} ${childPositionZ}`);
        childElement.setAttribute(
          'geometry',
          `primitive: plane; height: ${childGuiItem.height}; width: ${childGuiItem.width};`,
        );

        const childFlexContainer = childElement.components['gui-flex-container'];
        if (childFlexContainer) {
          childFlexContainer.setBackground();
        }
      }
    }

    onAppendChildToContainer(this.el, function (containerElement, addedChildren) {
      //console.log('****** containerElement: ' + containerElement);
      //console.log('****** addedChildren: ' + addedChildren.length);
      // containerElement.components['gui-flex-container'].init();
      const addedChild = addedChildren[0];
      addedChildren[0].addEventListener('loaded', (e) => {
        //console.log('in appended element loaded handler: '+e);
        //console.log('addedChild: '+addedChild);
        //console.log('****** containerElement: ' + containerElement);
        containerElement.components['gui-flex-container'].init();
      });
    });
  },
  update() {
    console.log('업데이틑');
  },
  tick() {
    if (this.panelBackground) {
      if (this.data.visible) {
        this.panelBackground.setAttribute('visible', true);
        this.panelBackground.object3D.visible = true;
      } else {
        // this.panelBackground.object3D.removeFromParent();
        this.panelBackground.setAttribute('visible', false);
        this.panelBackground.object3D.visible = false;
      }
      // this.panelBackground!.object3D.visible = this.data.visible;
    }
  },
  remove() {
    if (!this.panelBackground) {
      return;
    }

    // this.el.object3D.remove(this.panelBackground);
    this.panelBackground.object3D.removeFromParent();
    this.panelBackground = null;
  },
  pause() {},
  play() {},
  getElementSize() {},
  setBackground() {
    if (this.data.opacity > 0) {
      const position: Vector3 = this.el.getAttribute('position');
      const rotation: Vector3 = this.el.getAttribute('rotation');

      console.log('panel position', position);
      const guiItem = this.el.getAttribute('gui-item');
      const panelBackground = document.createElement('a-entity');
      panelBackground.setAttribute(
        'rounded',
        styleStr({
          height: guiItem.height,
          width: guiItem.width,
          opacity: this.data.opacity,
          color: this.data.panelColor,
          radius: this.data.panelRounded,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: 2,
        }),
      );

      console.log('about to set panel background color to', this.data.panelColor);
      panelBackground.setAttribute(
        'position',
        coordStr({
          x: position.x,
          y: position.y,
          z: position.z - 0.0125,
        }),
      );
      panelBackground.setAttribute(
        'rotation',
        coordStr({
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
        }),
      );

      // panelBackground.setAttribute('visible', false);

      this.panelBackground = panelBackground;
      this.el.parentNode?.insertBefore(panelBackground, this.el);
    }
  },
});
