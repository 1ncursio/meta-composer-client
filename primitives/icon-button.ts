export default AFRAME.registerPrimitive('a-gui-icon-button', {
  defaultComponents: {
    'gui-interactable': {},
    'gui-item': { type: 'icon-button' },
    'gui-icon-button': {},
  },
  mappings: {
    //gui interactable general
    onclick: 'gui-interactable.clickAction',
    onhover: 'gui-interactable.hoverAction',
    'key-code': 'gui-interactable.keyCode',
    //gui item general
    width: 'gui-item.width',
    height: 'gui-item.height',
    margin: 'gui-item.margin',
    //gui button specific
    on: 'gui-icon-button.on',
    'font-color': 'gui-icon-button.fontColor',
    'font-family': 'gui-icon-button.fontFamily',
    'border-color': 'gui-icon-button.borderColor',
    'background-color': 'gui-icon-button.backgroundColor',
    'background-color-opacity': 'gui-icon-button.backgroundColorOpacity',
    'hover-color': 'gui-icon-button.hoverColor',
    'active-color': 'gui-icon-button.activeColor',
    icon: 'gui-icon-button.icon',
    'icon-active': 'gui-icon-button.iconActive',
    'icon-font': 'gui-icon-button.iconFont',
    'icon-font-size': 'gui-icon-button.iconFontSize',
    toggle: 'gui-icon-button.toggle',
    'toggle-state': 'gui-icon-button.toggleState',
  },
});
