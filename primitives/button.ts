export default AFRAME.registerPrimitive('a-gui-button', {
  defaultComponents: {
    'gui-interactable': {},
    'gui-item': { type: 'button' },
    'gui-button': {},
  },
  mappings: {
    //gui interactable general
    onclick: 'gui-interactable.clickAction',
    onhover: 'gui-interactable.hoverAction',
    'key-code': 'gui-interactable.keyCode',
    //gui item general
    width: 'gui-item.width',
    height: 'gui-item.height',
    depth: 'gui-item.depth',
    'base-depth': 'gui-item.baseDepth',
    gap: 'gui-item.gap',
    radius: 'gui-item.radius',
    margin: 'gui-item.margin',
    //gui item bevelbox
    bevel: 'gui-item.bevel',
    'bevel-segments': 'gui-item.bevelSegments',
    steps: 'gui-item.steps',
    'bevel-size': 'gui-item.bevelSize',
    'bevel-offset': 'gui-item.bevelOffset',
    'bevel-thickness': 'gui-item.bevelThickness',
    //gui button specific
    on: 'gui-button.on',
    value: 'gui-button.value',
    'font-size': 'gui-button.fontSize',
    'font-family': 'gui-button.fontFamily',
    'font-color': 'gui-button.fontColor',
    'border-color': 'gui-button.borderColor',
    'focus-color': 'gui-button.focusColor',
    'background-color': 'gui-button.backgroundColor',
    'hover-color': 'gui-button.hoverColor',
    'active-color': 'gui-button.activeColor',
    toggle: 'gui-button.toggle',
    'toggle-state': 'gui-button.toggleState',
  },
});
