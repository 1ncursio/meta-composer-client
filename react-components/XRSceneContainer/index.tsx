import { Assets, Entity, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import 'aframe';
import '@components/item';
import '@components/bevelbox';
import '@components/interactable';
import '@components/flex-container';
import '@primitives/flex-container';
import '@components/label';
import '@primitives/label';
import '@components/button';
import '@primitives/button';
import '@components/slider';
import '@primitives/slider';
import '@components/vertical-slider';
import '@primitives/vertical-slider';
import '@components/draw-canvas';
import '@components/icon-button';
import Piano from '@react-components/Piano';
import '@components/text-button';
import '@components/rounded';
import SheetEntity from '@react-components/SheetEntity';
import s from '@utils/s';
import 'aframe-troika-text';
import 'aframe-geometry-merger-component';
import 'aframe-html-shader';
import 'aframe-slice9-component';
import Script from 'next/script';
import React from 'react';

window.handlePianoX = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  console.log({ e, percent });
  piano.setAttribute('position', `${percent * 2 - 1} 0 0`);
};

window.handlePianoY = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  console.log({ e, percent });
  piano.setAttribute('position', `0 ${percent * 2 - 1} 0`);
};

window.handlePianoZ = (e: CustomEvent, percent: number) => {
  const piano = document.querySelector('#piano');
  console.log({ e, percent });
  piano.setAttribute('position', `0 0 ${percent * 2 - 1}`);
};

const XRSceneContainer = () => {
  return (
    <>
      <Script
        src="https://unpkg.com/aframe-environment-component@1.3.1/dist/aframe-environment-component.min.js"
        strategy="lazyOnload"
      />
      {/* <Script src="https://rawgit.com/rdub80/aframe-gui/master/dist/aframe-gui.min.js" strategy="lazyOnload" /> */}
      <Scene
        inspector={{
          url: new URL('https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js'),
        }}
        cursor={s({ rayOrigin: 'mouse', fuse: false })}
        raycaster={s({ objects: ['.raycastable', '[gui-interactable]'] })}
        // raycaster="objects: [gui-interactable], .raycastable"
        // background={{
        //   transparent: true,
        // }}
        // stats
      >
        {/* <Entity environment /> */}
        <Entity environment />
        <Assets>
          <img id="button" src="/assets/hud/button.9.png" alt="button" />
          <img id="mute_on" src="/assets/hud/mute_on.png" alt="button" />
          <img id="action-button" src="/assets/hud/action_button.9.png" alt="action-button" />
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
          slice9={s({
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
        <Plane position={{ x: 0, y: 0, z: 0 }} rotation={{ x: -90, y: 0, z: 0 }} width={1} height={1} color="#7BC8A4" />
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
        {/* <Sky color="#ECECEC" /> */}
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
          text-button={s({
            textHoverColor: '#fff',
            textColor: '#fff',
            backgroundColor: '#1da1f2',
            backgroundHoverColor: '#2db1ff',
          })}
          slice9={s({
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
          component-padding="0.1"
          opacity="0.7"
          width="3.5"
          height="6"
          panel-color="#072B73"
          panel-rounded="0.2"
          position="0 2.5 -6"
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

          <a-gui-button width="2.5" height="0.7" onclick="" value="Example 5"></a-gui-button>
          <a-gui-label
            width={2.5}
            height={0.75}
            value="X"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            margin="0 0 0.05 0"
          />
          <a-gui-slider width="2.5" height="0.75" onclick="handlePianoX" percent="0.29" margin="0 0 0.05 0" />
          <a-gui-label
            width={2.5}
            height={0.75}
            value="Y"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            margin="0 0 0.05 0"
          />
          <a-gui-slider width="2.5" height="0.75" onclick="handlePianoY" percent="0.29" margin="0 0 0.05 0" />
          <a-gui-label
            width={2.5}
            height={0.75}
            value="Z"
            font-size={0.35}
            line-height={0.8}
            letter-spacing={0}
            margin="0 0 0.05 0"
          />
          <a-gui-slider width="2.5" height="0.75" onclick="handlePianoZ" percent="0.29" margin="0 0 0.05 0" />

          {/* <a-gui-vertical-slider width="2.5" height="2" onclick="" percent="0.29" margin="0 0 0.05 0" /> */}

          {/* <a-gui-progressbar width="2.5" height="0.25" margin="0 0 0.1 0"></a-gui-progressbar> */}
        </a-gui-flex-container>
      </Scene>
    </>
  );
};

export default XRSceneContainer;
