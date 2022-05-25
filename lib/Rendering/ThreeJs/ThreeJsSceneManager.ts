import CONST from '@lib/midi/CONST';
import * as THREE from 'three';

export class ThreeJsSceneManager {
  sceneBehindNotes: THREE.Scene;
  sceneBehindPiano: THREE.Scene;
  sceneFront: THREE.Scene;

  constructor() {
    this.sceneBehindNotes = new THREE.Scene();
    this.sceneBehindPiano = new THREE.Scene();
    this.sceneFront = new THREE.Scene();
  }

  getScene(distrZ: keyof typeof CONST.DISTRIBUTIONS.Z) {
    switch (distrZ) {
      case CONST.DISTRIBUTIONS.Z.BEHIND_NOTES:
        return this.sceneBehindNotes;
      case CONST.DISTRIBUTIONS.Z.BEHIND_PIANO:
        return this.sceneBehindPiano;
      case CONST.DISTRIBUTIONS.Z.FRONT_OF_PIANO:
        return this.sceneFront;

      default:
        break;
    }
  }

  getScenes() {
    return [this.sceneBehindNotes, this.sceneBehindPiano, this.sceneFront];
  }
}
