import * as THREE from 'three';

export class ThreeJsTextureManager {
  textures: { [key: string]: THREE.Texture };
  loader: THREE.TextureLoader;

  constructor() {
    this.textures = {};
    this.loader = new THREE.TextureLoader();
  }

  loadTexture(textureName: string, callback: (texture: THREE.Texture) => void = () => {}) {
    if (!this.textures.hasOwnProperty(textureName)) {
      this.loader.load(
        '../../../images/particles/' + textureName + '.png',
        (texture) => {
          this.textures[textureName] = texture;
          callback(texture);
        },
        undefined,
        function (err) {
          console.log('Error loading texture: ' + err);
        },
      );
    }
  }

  getTexture(textureName: string) {
    if (!this.textures.hasOwnProperty(textureName)) {
      this.loadTexture(textureName);
    }
    return this.textures[textureName];
  }
}
