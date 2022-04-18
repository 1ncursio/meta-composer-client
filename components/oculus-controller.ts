import { Vector3 } from 'three';

export default AFRAME.registerComponent('oculus-controller', {
  init() {
    this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'q') {
        const { x, y, z } = this.el.getAttribute('position');
        console.log({ x, y, z });
      }
    });
  },
  onTriggerDown(e: Event) {
    console.log({ e });
    const position: Vector3 = this.el.getAttribute('position');
    const rotation: Vector3 = this.el.getAttribute('rotation');

    console.log({ position, rotation });
  },
  remove() {
    this.el.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
  },
});
