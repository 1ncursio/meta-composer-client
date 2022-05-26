// @ts-nocheck

import { RenderDimensions } from '@lib/midi/RenderDimensions';
import { DomHelper } from '../../ui/DomHelper.js';
import { ThreeJsParticle } from './threeJsParticles.js';
import { ThreeJsPianoLine } from './threeJsPianoLine.js';
import { ThreeJsSceneManager } from './ThreeJsSceneManager';
import { ThreeJsTextureManager } from './ThreeJsTextureManager';

//todo make point pool and recycle threejs objects.
export class ThreeJsHandler {
  renderDimensions: RenderDimensions;
  //   cnv0: HTMLCanvasElement;
  //   cnv1: HTMLCanvasElement;
  //   cnv2: HTMLCanvasElement;

  constructor(renderDimensions: RenderDimensions) {
    this.renderDimensions = renderDimensions;
  }
  init() {
    this.setupCanvases();

    this.renderDimensions.registerResizeCallback(() => {
      this.cnv0.width = this.renderDimensions.windowWidth;
      this.cnv0.height = this.renderDimensions.windowHeight;
      this.cnv1.width = this.renderDimensions.windowWidth;
      this.cnv1.height = this.renderDimensions.windowHeight;
      this.cnv2.width = this.renderDimensions.windowWidth;
      this.cnv2.height = this.renderDimensions.windowHeight;

      this.camera.left = this.renderDimensions.windowWidth / -2;
      this.camera.right = this.renderDimensions.windowWidth / 2;
      this.camera.top = this.renderDimensions.windowHeight / 2;
      this.camera.bottom = this.renderDimensions.windowHeight / -2;

      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight, 1);
    });

    this.camera = new THREE.OrthographicCamera(
      this.renderDimensions.windowWidth / -2,
      this.renderDimensions.windowWidth / 2,
      this.renderDimensions.windowHeight / 2,
      this.renderDimensions.windowHeight / -2,
      1,
      1000,
    );
    this.camera.position.set(0, 0, 500);

    this.sceneManager = new ThreeJsSceneManager();
    this.textureManager = new ThreeJsTextureManager();
    this.threeJsParticles = new ThreeJsParticle(this.renderDimensions);
    this.threeJsPianoLine = new ThreeJsPianoLine(this.renderDimensions);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);

    // this.setupSettings()

    // this.createPianoLine()
  }

  setupCanvases() {
    this.cnv0 = DomHelper.createCanvas(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.cnv1 = DomHelper.createCanvas(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.cnv2 = DomHelper.createCanvas(this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);

    this.cnv0.style.zIndex = 1;
    this.cnv1.style.zIndex = 5;
    this.cnv2.style.zIndex = 105;

    this.ctx0 = this.cnv0.getContext('2d');
    this.ctx1 = this.cnv1.getContext('2d');
    this.ctx2 = this.cnv2.getContext('2d');

    this.cnv0.style.position = 'absolute';
    this.cnv1.style.position = 'absolute';
    this.cnv2.style.position = 'absolute';

    this.cnv0.style.pointerEvents = 'none';
    this.cnv1.style.pointerEvents = 'none';
    this.cnv2.style.pointerEvents = 'none';
    DomHelper.appendChildren(document.body, [this.cnv0, this.cnv1, this.cnv2]);
  }

  render(time = 10) {
    this.threeJsParticles.render();
    this.threeJsPianoLine.render();

    this.ctx0.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.ctx1.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);
    this.ctx2.clearRect(0, 0, this.renderDimensions.windowWidth, this.renderDimensions.windowHeight);

    let ctxs = [this.ctx0, this.ctx1, this.ctx2];
    this.sceneManager.getScenes().forEach((scene, i) => {
      this.renderer.render(scene, this.camera);
      ctxs[i].drawImage(this.renderer.domElement, 0, 0);
    });
  }
}

var threeJsHandler;
export const initThreeJs = (renderDimensions) => {
  threeJsHandler = new ThreeJsHandler(renderDimensions);
  threeJsHandler.init();
};
export const getThreeJsHandler = () => threeJsHandler;
export const threeJsRender = (time) => threeJsHandler.render(time);
export const createThreeJsParticles = (renderInfo) => {
  threeJsHandler.threeJsParticles.create(renderInfo);
};

export const getTheeJsColor = (str) => {
  let spl = str.split(',');
  spl.splice(spl.length - 1, 1);
  str = spl.join(',').replace('rgba', 'rgb') + ')';
  let colorObj = new THREE.Color();
  colorObj.setStyle(str);
  return colorObj;
};
export const getTexture = (textureName) => threeJsHandler.textureManager.getTexture(textureName);
export const loadTexture = (textureName, callback) => threeJsHandler.textureManager.loadTexture(textureName, callback);
export const getScene = (sceneName) => threeJsHandler.sceneManager.getScene(sceneName);
