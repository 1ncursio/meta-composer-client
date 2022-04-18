export default AFRAME.registerComponent('canvas-updater', {
  dependencies: ['geometry', 'material'],

  tick: function () {
    // @ts-ignore
    const { material } = this.el.getObject3D('mesh');
    if (!material.map) {
      return;
    }
    material.map.needsUpdate = true;
  },
});
