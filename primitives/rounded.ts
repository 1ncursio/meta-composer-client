export default AFRAME.registerPrimitive('a-rounded', {
  defaultComponents: {
    rounded: {},
  },
  mappings: {
    enabled: 'rounded.enabled',
    width: 'rounded.width',
    height: 'rounded.height',
    radius: 'rounded.radius',
    'depth-write': 'rounded.depthWrite',
    'polygon-offset': 'rounded.polygonOffset',
    'polygon-offset-factor': 'rounded.polygonOffsetFactor',
    'top-left-radius': 'rounded.topLeftRadius',
    'top-right-radius': 'rounded.topRightRadius',
    'bottom-left-radius': 'rounded.bottomLeftRadius',
    'bottom-right-radius': 'rounded.bottomRightRadius',
    color: 'rounded.color',
    opacity: 'rounded.opacity',
  },
});
