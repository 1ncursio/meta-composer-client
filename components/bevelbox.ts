import THREE from 'three';

export default AFRAME.registerComponent('bevelbox', {
  schema: {
    width: { type: 'number', default: 1 },
    height: { type: 'number', default: 1 },
    depth: { type: 'number', default: 1 },

    topLeftRadius: { type: 'number', default: 0.00001 },
    topRightRadius: { type: 'number', default: 0.00001 },
    bottomLeftRadius: { type: 'number', default: 0.00001 },
    bottomRightRadius: { type: 'number', default: 0.00001 },

    bevelEnabled: { type: 'boolean', default: true },
    bevelSegments: { type: 'number', default: 2 },
    steps: { type: 'number', default: 1 },
    bevelSize: { type: 'number', default: 0.1 },
    bevelOffset: { type: 'number', default: 0 },
    bevelThickness: { type: 'number', default: 0.1 },
  },

  multiple: false,

  init() {
    const el = this.el;
    const data = this.data;

    const _w = data.width;
    const _h = data.height;
    const _x = -data.width / 2;
    const _y = -data.height / 2;

    const shape = new THREE.Shape();
    shape.moveTo(_x, _y + data.topLeftRadius);
    shape.lineTo(_x, _y + _h - data.topLeftRadius);
    shape.quadraticCurveTo(_x, _y + _h, _x + data.topLeftRadius, _y + _h);
    shape.lineTo(_x + _w - data.topRightRadius, _y + _h);
    shape.quadraticCurveTo(_x + _w, _y + _h, _x + _w, _y + _h - data.topRightRadius);
    shape.lineTo(_x + _w, _y + data.bottomRightRadius);
    shape.quadraticCurveTo(_x + _w, _y, _x + _w - data.bottomRightRadius, _y);
    shape.lineTo(_x + data.bottomLeftRadius, _y);
    shape.quadraticCurveTo(_x, _y, _x, _y + data.bottomLeftRadius);

    const extrudedShape = this.extrude(shape);

    el.setObject3D('mesh', extrudedShape);
  },

  extrude(roundedBase: THREE.Shape) {
    const el = this.el;
    const data = this.data;

    const extrudeSettings = {
      steps: data.steps,
      depth: data.depth,
      bevelEnabled: data.bevelEnabled,
      bevelThickness: data.bevelThickness,
      bevelSize: data.bevelSize,
      bevelOffset: data.bevelOffset,
      bevelSegments: data.bevelSegments,
    };

    const extrudedGeometry = new THREE.ExtrudeGeometry(roundedBase, extrudeSettings);
    return new THREE.Mesh(
      extrudedGeometry,
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
      }),
    );
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update(oldData) {},

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove() {},

  /**
   * Called on each scene tick.
   */
  // tick (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause() {},

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play() {},
});
