import CONST from '@lib/midi/CONST';
import { RenderDimensions } from '@lib/midi/RenderDimensions';
import { rndFloat } from '@utils/util';
import { getSetting } from '../../settings/Settings';
import { getTexture, getTheeJsColor } from './threeJsHandler';

export class ThreeJsBuffer {
  constructor(renderDimensions: RenderDimensions, opts, color: string, bufferAmount: number) {
    this.freeSpace = bufferAmount;
    this.cursor = 0;
    this.timestamps = [];

    this.renderDimensions = renderDimensions;
    this.bufferAmount = bufferAmount;
    this.color = color;
    this.opts = opts;

    this.init();
  }
  init() {
    let opts = this.opts;
    let bufferAmount = this.bufferAmount;
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array(bufferAmount * 3);

    let startingRotations = new Float32Array(bufferAmount * 1);
    let rotationSpeeds = new Float32Array(bufferAmount * 1);
    let randomX = new Float32Array(bufferAmount * 1);
    let randomY = new Float32Array(bufferAmount * 1);
    let radius = new Float32Array(bufferAmount * 1);
    let motX = new Float32Array(bufferAmount * 1);
    let motY = new Float32Array(bufferAmount * 1);
    let startTime = new Float32Array(bufferAmount * 1);

    this.geometry = geometry;
    this.bufferCache = {
      vertices,
      startingRotations,
      rotationSpeeds,
      randomX,
      randomY,
      radius,
      motX,
      motY,
      startTime,
    };
    if (!this.uniforms) {
      this.initUniforms(opts);
    }

    this.initMaterial(opts);
    if (!this.points) {
      this.points = new THREE.Points(this.geometry, this.material);
    } else {
      this.points.material = this.material;
      this.points.geometry = this.geometry;
    }
  }
  initMaterial(opts) {
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
    this.material = this.getParticleShaderMaterial(this.uniforms, CONST.BLENDING[opts.particlesBlending]);
  }
  initUniforms(opts) {
    this.uniforms = {
      time: { type: 'f', value: window.performance.now() / 17 },
      particleLife: { type: 'f', value: opts.particleLife },
      particleRising: {
        type: 'f',
        value: parseFloat(opts.particleRising) + 15,
      },
      particleSpeed: { type: 'f', value: opts.particleSpeed },
      particlesShrink: { type: 'f', value: opts.particlesShrink },
      particlesFriction: { type: 'f', value: opts.particlesFriction },
      particlesOpacity: { type: 'f', value: opts.particlesOpacity },
      turbulenceXFrequency: {
        type: 'f',
        value: opts.turbulenceXFrequency,
      },
      turbulenceYFrequency: {
        type: 'f',
        value: opts.turbulenceYFrequency,
      },
      turbulenceXAmplitude: {
        type: 'f',
        value: opts.turbulenceXAmplitude,
      },
      turbulenceYAmplitude: {
        type: 'f',
        value: opts.turbulenceYAmplitude,
      },
      particleFadeOut: {
        type: 'f',
        value: parseFloat(opts.particleFadeOut),
      },
      particleSize: { type: 'f', value: parseFloat(opts.particleSize) },
      screenWidth: { type: 'f', value: this.renderDimensions.windowWidth },
      screenHeight: { type: 'f', value: this.renderDimensions.windowHeight },
      particlesTexture: { type: 't', value: getTexture(opts.particlesTexture) },
      color: { type: 'vec3', value: getTheeJsColor(this.color) },
      particleYOffset: { type: 'f', value: opts.particleYOffset },
    };
  }
  refreshMaterial(blending) {
    this.initMaterial({ particlesBlending: blending });
    this.points.material = this.material;
  }
  increaseSize(factor) {
    let oldAmount = this.bufferAmount;
    this.bufferAmount = Math.min(
      parseFloat(getSetting('particlesMaxTextureSize')),
      Math.ceil(this.bufferAmount * factor),
    );
    if (oldAmount >= this.bufferAmount) return;
    this.freeSpace += this.bufferAmount - oldAmount;

    let vertices = this.bufferCache.vertices;
    let startingRotations = this.bufferCache.startingRotations;
    let rotationSpeeds = this.bufferCache.rotationSpeeds;
    let randomX = this.bufferCache.randomX;
    let randomY = this.bufferCache.randomY;
    let radius = this.bufferCache.radius;
    let motX = this.bufferCache.motX;
    let motY = this.bufferCache.motY;
    let startTime = this.bufferCache.startTime;

    this.init();

    this.bufferCache.vertices.set(vertices, 0);
    this.bufferCache.startingRotations.set(startingRotations, 0);
    this.bufferCache.rotationSpeeds.set(rotationSpeeds, 0);
    this.bufferCache.randomX.set(randomX, 0);
    this.bufferCache.randomY.set(randomY, 0);
    this.bufferCache.radius.set(radius, 0);
    this.bufferCache.motX.set(motX, 0);
    this.bufferCache.motY.set(motY, 0);
    this.bufferCache.startTime.set(startTime, 0);

    this.initMaterial(this.opts);
  }
  dispose() {
    Object.keys(this.bufferCache).forEach((key) => {
      this.bufferCache[key] = null;
    });

    this.bufferCache = null;

    this.points.material.dispose();
    this.points.geometry.dispose();

    this.points.material = null;
    this.points.geometry = null;

    this.geometry.dispose();
    this.geometry = null;

    this.material.dispose();
    this.material = null;

    this.uniforms = null;
    this.opts = null;
    this.points = null;
  }
  addParticles(amount, renderInfo, opts) {
    this.lastUsed = window.performance.now() / 17;
    this.timestamps.push({ amount, timestamp: window.performance.now() / 17 });
    this.freeSpace -= amount;
    if (this.freeSpace < 0) {
      // console.log("isFULL")
      //TODO - causes webgl to die
      // this.increaseSize(1.5)
    }

    let distr = this.getDistributions(renderInfo, opts.particleDistributionX, opts.particleDistributionY);

    let partSize = parseFloat(opts.particleSize);
    let initialX = opts.particleSpeedX;
    let initialY = opts.particleSpeedY;
    for (var g = this.cursor; g < this.cursor + amount * 1; g++) {
      let index = g % this.bufferAmount;
      this.bufferCache.vertices[index * 3] = distr.x - this.renderDimensions.windowWidth / 2 + Math.random() * distr.w;
      this.bufferCache.vertices[index * 3 + 1] =
        this.renderDimensions.windowHeight / 2 - distr.y - Math.random() * distr.h;
      this.bufferCache.vertices[index * 3 + 2] = 1;

      this.bufferCache.startingRotations[index] =
        (opts.particlesRotation / 360) * Math.PI * 2 +
        rndFloat(-(opts.particlesRotationRandom / 180) * Math.PI, (opts.particlesRotationRandom / 180) * Math.PI);
      this.bufferCache.startTime[index] = window.performance.now() / 17;
      this.bufferCache.rotationSpeeds[index] = rndFloat(-opts.particlesRotationSpeed, opts.particlesRotationSpeed);
      this.bufferCache.randomX[index] = rndFloat(0, 2);
      this.bufferCache.randomY[index] = rndFloat(0, 2);
      this.bufferCache.radius[index] = rndFloat(0.0 * partSize, partSize);
      this.bufferCache.motX[index] = rndFloat(-initialX, initialX);
      this.bufferCache.motY[index] = rndFloat(initialY * 0.0, initialY);
    }
    this.cursor += amount;
    let geometry = this.geometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(this.bufferCache.vertices, 3));
    geometry.setAttribute('rotation', new THREE.BufferAttribute(this.bufferCache.startingRotations, 1));
    geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(this.bufferCache.rotationSpeeds, 1));
    geometry.setAttribute('startTime', new THREE.BufferAttribute(this.bufferCache.startTime, 1));
    geometry.setAttribute('randomX', new THREE.BufferAttribute(this.bufferCache.randomX, 1));
    geometry.setAttribute('randomY', new THREE.BufferAttribute(this.bufferCache.randomY, 1));
    geometry.setAttribute('radius', new THREE.BufferAttribute(this.bufferCache.radius, 1));
    geometry.setAttribute('motX', new THREE.BufferAttribute(this.bufferCache.motX, 1));
    geometry.setAttribute('motY', new THREE.BufferAttribute(this.bufferCache.motY, 1));
  }

  update() {
    if (this.isDisposed) return;
    if (window.performance.now() / 17 - this.lastUsed > 500 + parseFloat(this.uniforms.particleLife.value)) {
      this.isDisposed = true;
      return;
    }
    let now = window.performance.now() / 17;
    this.uniforms.time.value = now;
    for (let i = this.timestamps.length - 1; i >= 0; i--) {
      let timestampObj = this.timestamps[i];
      if (timestampObj.timestamp + parseFloat(this.uniforms.particleLife.value) < now) {
        this.freeSpace += timestampObj.amount;
        this.timestamps.splice(i, 1);
      }
    }
  }
  getDistributions(renderInfo, distrX, distrY) {
    let x = renderInfo.x;
    let w = renderInfo.w;
    let y = renderInfo.y;
    let h = renderInfo.h;
    switch (distrX) {
      case CONST.DISTRIBUTIONS.X.ACROSS:
        let spread = (w * getSetting('particleDistributionXSpread')) / 100;
        x = x + w / 2 - spread / 2;
        w = spread;
        break;
      case CONST.DISTRIBUTIONS.X.LEFT:
        w = 1;
        break;
      case CONST.DISTRIBUTIONS.X.RIGHT:
        x = x + w - 1;
        w = 1;
        break;

      default:
        break;
    }
    let keyHeight = renderInfo.isBlack ? this.renderDimensions.blackKeyHeight : this.renderDimensions.whiteKeyHeight;
    switch (distrY) {
      case CONST.DISTRIBUTIONS.Y.NOTE_TOP:
        h = 1;
        break;
      case CONST.DISTRIBUTIONS.Y.ACROSS_NOTE:
        break;
      case CONST.DISTRIBUTIONS.Y.NOTE_BOTTOM:
        y = y + h - 1;
        h = 1;
        break;
      case CONST.DISTRIBUTIONS.Y.KEYS_TOP:
        y = this.renderDimensions.getAbsolutePianoPosition();
        h = 1;
        break;
      case CONST.DISTRIBUTIONS.Y.ACROSS_KEYS:
        y = this.renderDimensions.getAbsolutePianoPosition();
        h = keyHeight;
        break;
      case CONST.DISTRIBUTIONS.Y.KEYS_BOTTOM:
        y = this.renderDimensions.getAbsolutePianoPosition() + keyHeight - 1;
        h = 1;
        break;

      default:
        break;
    }
    return { x, y, w, h };
  }
  getParticleShaderMaterial(uniforms, blending) {
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      opacity: 1,
      blending: blending,
      vertexShader: this.getParticleVertexShader(),
      fragmentShader: this.getParticleFragmentShader(),
    });
  }
  getParticleVertexShader() {
    if (!this.particleVertexShader) {
      this.particleVertexShader = document.getElementById('vertexShader').textContent;
    }
    return this.particleVertexShader;
  }
  getParticleFragmentShader() {
    if (!this.particleFragmentShader) {
      this.particleFragmentShader = document.getElementById('fragmentShader').textContent;
    }
    return this.particleFragmentShader;
  }
}
