export default AFRAME.registerPrimitive('a-gui-label', {
  defaultComponents: {
    'gui-item': { type: 'label' },
    'gui-label': {},
  },
  mappings: {
    width: 'gui-item.width',
    height: 'gui-item.height',
    margin: 'gui-item.margin',
    align: 'gui-label.align',
    anchor: 'gui-label.anchor',
    value: 'gui-label.value',
    'font-size': 'gui-label.fontSize',
    'line-height': 'gui-label.lineHeight',
    'letter-spacing': 'gui-label.letterSpacing',
    'font-color': 'gui-label.fontColor',
    'font-family': 'gui-label.fontFamily',
    'background-color': 'gui-label.backgroundColor',
    opacity: 'gui-label.opacity',
    'text-depth': 'gui-label.textDepth',
  },
});
