import CONST from '@lib/midi/CONST';
import { RenderDimensions } from '@lib/midi/RenderDimensions';
import { getSetting, setSettingCallback } from '../../settings/Settings';
import { getScene, getTheeJsColor } from './threeJsHandler';

export class ThreeJsPianoLine {
  renderDimensions: RenderDimensions;

  constructor(renderDimensions: RenderDimensions) {
    this.renderDimensions = renderDimensions;
    this.setupSettings();

    let uniforms = {
      time: { type: 'f', value: 0 },
      screenWidth: { type: 'f', value: this.renderDimensions.windowWidth },
      screenHeight: { type: 'f', value: this.renderDimensions.windowHeight },
      noiseA: { type: 'f', value: this.pianoLineNoiseA },
      noiseB: { type: 'f', value: this.pianoLineNoiseB },
      noiseC: { type: 'f', value: this.pianoLineNoiseC },
      noiseD: { type: 'f', value: this.pianoLineNoiseD },
      opacity: { type: 'f', value: this.pianoLineOpacity },
      color: {
        type: 'vec3',
        value: getTheeJsColor(this.pianoLineColor),
      },
      resolution: { type: 'f', value: this.pianoLineResolution },
      reflection: { type: 'f', value: this.pianoLineReflection },
      amplitude: {
        type: 'vec3',
        value: this.pianoLineAmplitude,
      },

      yOffset: {
        type: 'f',
        value: this.renderDimensions.getAbsolutePianoPosition() + parseFloat(this.pianoLineYOffset),
      },
    };
    this.uniforms = uniforms;

    this.addSettingCallbacksToUniforms([
      [uniforms.noiseA, 'pianoLineNoiseA'],
      [uniforms.noiseB, 'pianoLineNoiseB'],
      [uniforms.noiseC, 'pianoLineNoiseC'],
      [uniforms.noiseD, 'pianoLineNoiseD'],
      [uniforms.opacity, 'pianoLineOpacity'],
      [uniforms.resolution, 'pianoLineResolution'],
      [uniforms.reflection, 'pianoLineReflection'],
      [uniforms.amplitude, 'pianoLineAmplitude'],
    ]);

    this.renderDimensions.registerResizeCallback(() => {
      this.uniforms.screenWidth.value = this.renderDimensions.windowWidth;
      this.uniforms.screenHeight.value = this.renderDimensions.windowHeight;

      this.createShader();
    });

    setSettingCallback('pianoLineColor', () => {
      this.uniforms.color.value = getTheeJsColor(getSetting('pianoLineColor'));
    });
    setSettingCallback('pianoResized', () => {
      this.uniforms.yOffset.value =
        this.renderDimensions.getAbsolutePianoPosition() + parseFloat(getSetting('pianoLineYOffset'));
    });
    setSettingCallback('pianoLineYOffset', () => {
      this.uniforms.yOffset.value =
        this.renderDimensions.getAbsolutePianoPosition() + parseFloat(getSetting('pianoLineYOffset'));
    });
    setSettingCallback('pianoLineEnabled', () => {
      if (getSetting('pianoLineEnabled')) {
        this.createShader();
      } else {
        this.removeShader();
      }
    });

    this.createShader();
  }
  getGeometry() {
    return new THREE.PlaneBufferGeometry(
      this.renderDimensions.windowWidth,
      this.renderDimensions.windowHeight,
      1,
      1,
      -this.renderDimensions.windowWidth / 2,
      0,
    );
  }
  createShader(geometry) {
    if (this.pianoLine) {
      this.removeShader();
    }

    let material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      opacity: 1,
      vertexShader: document.getElementById('simpleVertex').textContent,
      fragmentShader: document.getElementById('fragmentShaderPianoLine2').textContent,
    });

    let point = new THREE.Mesh(this.getGeometry(), material);
    this.pianoLine = { point, start: window.performance.now() };

    getScene(CONST.DISTRIBUTIONS.Z.FRONT_OF_PIANO).add(point);
  }
  removeShader() {
    if (this.pianoLine) {
      this.pianoLine.point.material.dispose();
      this.pianoLine.point.geometry.dispose();
      getScene(CONST.DISTRIBUTIONS.Z.FRONT_OF_PIANO).remove(this.pianoLine.point);
      this.pianoLine = null;
    }
  }
  setupSettings() {
    let settingIds = [
      'pianoLineSpeed',
      'pianoLineNoiseA',
      'pianoLineNoiseB',
      'pianoLineNoiseC',
      'pianoLineNoiseD',
      'pianoLineOpacity',
      'pianoLineColor',
      'pianoLineResolution',
      'pianoLineReflection',
      'pianoLineAmplitude',
      'pianoLineYOffset',
    ];
    settingIds.forEach((settingId) => {
      this[settingId] = getSetting(settingId);
      setSettingCallback(settingId, () => {
        this[settingId] = getSetting(settingId);
      });
    });
  }
  render() {
    if (this.pianoLine) {
      this.uniforms.time.value += parseFloat(this.pianoLineSpeed) * 0.001;
    }
  }

  addSettingCallbacksToUniforms(arr) {
    arr.forEach((el) => this.addSettingCallbackToUniform(el[0], el[1]));
  }
  addSettingCallbackToUniform(uniformVal, settingId) {
    setSettingCallback(settingId, () => (uniformVal.value = getSetting(settingId)));
  }
}
