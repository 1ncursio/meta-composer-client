import 'aframe';
import 'aframe-geometry-merger-component';
import 'aframe-html-shader';
import 'aframe-slice9-component';
import 'aframe-troika-text';
import '@components/bevelbox';
import '@components/button';
import '@components/draw-canvas';
import '@components/flex-container';
import '@components/icon-button';
import '@components/interactable';
import '@components/item';
import '@components/label';
import '@components/rounded';
import '@components/slider';
import '@components/text-button';
import '@components/vertical-slider';
import '@primitives/button';
import '@primitives/flex-container';
import '@primitives/icon-button';
import '@primitives/label';
import '@primitives/slider';
import '@primitives/vertical-slider';
import { Assets, Entity, Light, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import Piano from '@react-components/Piano';
import useStore from '@store/useStore';
import { coordStr, styleStr } from '@utils/aframeUtils';
import React from 'react';
import { Vector3 } from 'three';

window.handlePianoX = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  const { x, y, z }: Vector3 = piano.getAttribute('position');

  // percent가 0~1 일때, x를 x-2 ~ x+2 사이로 조정해줌.
  const newX = x + (percent - 0.5) * 4;

  piano.setAttribute('position', coordStr({ x: newX, y, z }));
};

window.handlePianoY = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  const { x, y, z }: Vector3 = piano.getAttribute('position');

  // percent가 0~1 일때, y를 y-2 ~ y+2 사이로 조정해줌.
  const newY = y + (percent - 0.5) * 4;
  piano.setAttribute('position', coordStr({ x, y: newY, z }));
};

window.handlePianoZ = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  const { x, y, z }: Vector3 = piano.getAttribute('position');

  // percent가 0~1 일때, z를 z-2 ~ z+2 사이로 조정해줌.
  const newZ = z + (percent - 0.5) * 4;

  piano.setAttribute('position', coordStr({ x, y, z: newZ }));
};

const XRSceneContainer = () => {
  const { onClickHandler } = useStore((state) => state.xr);
  return (
    <>
      {/* <Script src="https://unpkg.com/aframe-environment-component@1.3.1/dist/aframe-environment-component.min.js" /> */}
      {/* <Script src="https://rawgit.com/rdub80/aframe-gui/master/dist/aframe-gui.min.js" strategy="lazyOnload" /> */}
      <Scene
        inspector={{
          url: new URL('https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js'),
        }}
        cursor={styleStr({ rayOrigin: 'mouse', fuse: false })}
        raycaster={styleStr({ objects: ['.raycastable', '[gui-interactable]'] })}
        stats
        // background={{
        //   transparent: true,
        // }}
      >
        {/* <Entity environment /> */}
        <Assets>
          <img id="button" src="/assets/hud/button.9.png" alt="button" />
          <img id="mute_on" src="/assets/hud/mute_on.png" alt="button" />
          <img id="action-button" src="/assets/hud/action_button.9.png" alt="action-button" />
          <img id="sky-texture" src="https://cdn.aframe.io/360-image-gallery-boilerplate/img/sechelt.jpg" />
          <img id="ground-texture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
        </Assets>
        {/* <Camera
    lookControls={{
      enabled: true,
    }}
  > */}
        {/* <Cursor
    cursor={{
      rayOrigin: 'mouse',
      mouseCursorStylesEnabled: true,
      fuse: false,
      fuseTimeout: 500,
    }}
    raycaster={{
      objects: '.raycastable',
    }}
  /> */}
        {/* </Camera> */}
        <Piano
          position={{
            x: 0,
            y: 0.75,
            z: -0.4,
          }}
        />
        {/* <Mixin
    id="frame"
    geometry={{
      primitive: 'plane',
      width: 1,
      height: 1,
    }}
    material={{
      color: '#ffffff',
      shader: 'flat',
    }}
  /> */}
        {/* AFRAME GUI 스크립트 */}
        {/* <Script src="https://rawgit.com/rdub80/aframe-gui/master/dist/aframe-gui.min.js" strategy="lazyOnload" /> */}
        {/* <a-gui-button
    width="2.5"
    height="0.7"
    base-depth="0.025"
    depth="0.1"
    gap="0.1"
    onclick={onClickTest}
    key-code="32"
    value="Sample Button"
    font-family="assets/fonts/PermanentMarker-Regular.ttf"
    font-size="0.25"
    margin="0 0 0.05 0"
    font-color="black"
    active-color="red"
    hover-color="yellow"
    border-color="white"
    focus-color="black"
    background-color="orange"
    bevel="true"
    position="0 0.5 -0.5"
  /> */}
        {/* <a-gui-radio
    width="2"
    height="0.5"
    onclick={onClickTest}
    value="label radio"
    margin="0 0 0.05 0"
    font-color="#006064"
    border-color="#006064"
    background-color="#E0F7FA"
    hover-color="#00838F"
    active-color="#FFEB3B"
    handle-color="#00838F"
  ></a-gui-radio> */}
        <Text
          position={{
            x: 0,
            y: 1,
            z: 0,
          }}
          className="raycastable"
          align="center"
          value="unmute"
          mixin="rounded-text-button"
          shader="msdf"
          width={2}
        />
        {/* <Entity
    position={{
      x: 0,
      y: 1,
      z: 0,
    }}
    mixin="rounded-text-button"
    // font="https://raw.githubusercontent.com/myso-kr/aframe-fonts-korean/master/fonts/ofl/nanumgothic/NanumGothic-Regular.json"
    className="raycastable"
  >
    <Text align="center" value="unmute" shader="msdf" width={2} />
  </Entity> */}
        <Entity
          position={{
            x: 0,
            y: 1,
            z: -1,
          }}
          className="raycastable capture-audio"
          mixin="rounded-action-button"
        >
          <Entity
            icon-button="image: unmute-action.png; hoverImage: unmute-action.png; activeImage: mute-action.png; activeHoverImage: mute-action.png"
            scale={{
              x: 0.5,
              y: 0.5,
              z: 0.5,
            }}
          />
        </Entity>
        <Mixin
          id="rounded-action-button"
          slice9={styleStr({
            width: 0.2,
            height: 0.2,
            left: 64,
            top: 64,
            right: 66,
            bottom: 66,
            transparent: false,
            alphaTest: 0.1,
            src: '#action-button',
          })}
        />
        <Plane
          rotation={{ x: -90, y: 0, z: 0 }}
          width={30}
          height={30}
          src="#ground-texture"
          // repeat={{
          //   x: 10,
          //   y: 10,
          // }}
          gui-interactable
          onClick={(e) => console.log('이게 된다고', e)}
        />
        {/* <a-mixin
    id="rounded-twitter-text-action-button"
    text-button="
                textHoverColor: #fff;
                textColor: #fff;
                backgroundColor: #1da1f2;
                backgroundHoverColor: #2db1ff;
                "
    slice9="
                width: 0.45;
                height: 0.2;
                left: 64;
                top: 64;
                right: 66;
                bottom: 66;
                transparent: false;
                alphaTest: 0.1;
                src: #button"
  ></a-mixin> */}
        <Sky src="#sky-texture" />
        <Light type="ambient" color="#445451" />
        <Light
          type="point"
          intensity={2}
          position={{
            x: 2,
            y: 4,
            z: 4,
          }}
        />
        {/* <a-entity geometry-merger="preserveOriginal: false" material="color: #AAA">
    <a-entity geometry="primitive: box; buffer: false" position="-1 0.5 -2"></a-entity>
    <a-entity geometry="primitive: sphere; buffer: false" position="0 0.5 -2"></a-entity>
    <a-entity geometry="primitive: cylinder; buffer: false" position="1 0.5 -2" scale="0.5 0.5 05"></a-entity>
  </a-entity> */}
        <Entity
          id="left-hand"
          handTrackingControls={{
            hand: 'left',
            modelColor: '#fbceb1',
          }}
          laserControls={{
            hand: 'left',
          }}
          oculusTouchControls={{
            hand: 'left',
          }}
          raycaster={{
            far: 100,
            objects: '.raycastable',
          }}
        />
        <Entity
          id="right-hand"
          handTrackingControls={{
            hand: 'right',
            modelColor: '#fbceb1',
          }}
          laserControls={{
            hand: 'right',
          }}
          oculusTouchControls={{
            hand: 'right',
          }}
          raycaster={{
            far: 100,
            objects: '.raycastable',
          }}
        />
        <Mixin
          id="rounded-text-button"
          text-button={styleStr({
            textHoverColor: '#fff',
            textColor: '#fff',
            backgroundColor: '#1da1f2',
            backgroundHoverColor: '#2db1ff',
          })}
          slice9={styleStr({
            color: '#0F40A9',
            width: 0.8,
            height: 0.2,
            left: 64,
            top: 64,
            right: 66,
            bottom: 66,
            src: '#button',
          })}
        />
        {/* <div
    style={{
      width: '100%',
      height: '100%',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: -1,
      overflow: 'hidden',
    }}
  ></div> */}
        {/* <SheetEntity /> */}
        <a-gui-flex-container
          flex-direction="column"
          justify-content="center"
          align-items="normal"
          component-padding={0.1}
          opacity={1}
          width={2}
          height={3}
          panel-color="#072B73"
          panel-rounded={0.1}
          position={coordStr({ x: 0, y: 2.5, z: -6 })}
          rotation="0 0 0"
        >
          {/* <a-gui-label
            width="2.5"
            height="0.75"
            value="test label"
            font-family="assets/fonts/DiplomataSC-Regular.ttf"
            font-size="0.35"
            line-height="0.8"
            letter-spacing="0"
            margin="0 0 0.05 0"
          ></a-gui-label> */}

          {/* <a-gui-radio
            width="2.5"
            height="0.75"
            onclick="testToggleAction"
            value="radio label"
            font-size="0.3"
            margin="0 0 0.05 0"
          ></a-gui-radio> */}

          {/* <a-gui-icon-label-button
            width="2.5"
            height="0.75"
            onclick="testButtonAction"
            icon="f2b9"
            icon-font="assets/fonts/fa-solid-900.ttf"
            value="icon label"
            font-family="assets/fonts/PressStart2P-Regular.ttf"
            font-size="0.16"
            margin="0 0 0.05 0"
          ></a-gui-icon-label-button> */}

          {/* <a-gui-toggle
            width="2.5"
            height="0.75"
            onclick="testToggleAction"
            value="toggle label"
            font-family="assets/fonts/Plaster-Regular.ttf"
            font-size="0.2"
            margin="0 0 0.05 0"
          ></a-gui-toggle> */}

          {/* <a-gui-button
            width="2.5"
            height="0.7"
            base-depth="0.025"
            depth="0.1"
            gap="0.1"
            onclick="buttonActionFunction"
            key-code="32"
            value="Sample Button"
            // font-family="assets/fonts/PermanentMarker-Regular.ttf"
            font-family="Roboto"
            font-size="0.25"
            margin="0 0 0.05 0"
            font-color="black"
            active-color="red"
            hover-color="yellow"
            border-color="white"
            focus-color="black"
            background-color="orange"
            bevel="true"
          ></a-gui-button> */}

          <a-gui-button width="2.5" height="0.7" onclick="" value="Adjust the position of the piano."></a-gui-button>
          <a-gui-label
            width={1.5}
            height={0.5}
            value="X"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            margin="0 0 0.05 0"
          />
          <a-gui-slider
            border-color="#f6f6f6"
            background-color="#072B73"
            active-color="#f59f0a"
            hover-color="#f97316"
            handle-outer-radius={0}
            handle-inner-radius={0.08}
            width={10}
            height={0.5}
            slider-bar-height={0.04}
            onClick={onClickHandler}
            percent={0.2}
            margin="0 0 0.05 0"
          />
          <a-gui-label
            width={1.5}
            height={0.75}
            value="Y"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            margin="0 0 0.05 0"
          />
          <a-gui-slider width="2.5" height="0.75" onclick="handlePianoY" percent={0.5} margin="0 0 0.05 0" />
          <a-gui-slider width="2.5" height="0.75" onclick="handlePianoZ" percent={0.5} margin="0 0 0.05 0" />
          <a-gui-icon-button
            height="0.75"
            onclick="testButtonAction"
            icon="f04c"
            icon-font="assets/fonts/fa-solid-900.ttf"
            icon-font-size={0.4}
            font-color="#f59f0a"
            hover-color="#fff"
            focus-color="#ccc"
            background-color="#fff"
          />
        </a-gui-flex-container>
      </Scene>
    </>
  );
};

export default XRSceneContainer;
