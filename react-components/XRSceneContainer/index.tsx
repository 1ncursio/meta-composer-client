import 'aframe';
import 'aframe-geometry-merger-component';
import 'aframe-html-shader';
import 'aframe-slice9-component';
import 'aframe-troika-text';
import '@components/oculus-controller';
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
import '@primitives/rounded';
import '@primitives/slider';
import '@primitives/vertical-slider';
import { Assets, Entity, Light, Mixin, Plane, Scene, Sky } from '@belivvr/aframe-react';
import { styleStr } from '@utils/aframeUtils';
import React, { useState } from 'react';
import SheetContainer from '@react-components/SheetContainer';
import PianoContainer from '@components/PianoContainer';
import useStore from '@store/useStore';
import XRToolbar from '@react-components/XRToolbar';
import SheetSearchContainer from '@react-components/SheetSearchContainer';
import { isDev } from '@utils/getEnv';

const XRSceneContainer = () => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const { offsetX, offsetY, offsetZ } = useStore((state) => state.xr);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-[9]">
          <Scene
            inspector={
              isDev()
                ? {
                    url: new URL(
                      'https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js',
                    ),
                  }
                : undefined
            }
            cursor={styleStr({ rayOrigin: 'mouse', fuse: false })}
            raycaster={styleStr({ objects: ['.raycastable', '[gui-interactable]'] })}
            stats={isDev()}
            embedded
            // className="w-full h-[90%]"
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
              <SheetContainer id="sheet" />
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
            {/* <Piano
          position={{
            x: 0,
            y: 0.75,
            z: -0.4,
          }}
        /> */}
            <PianoContainer
              position={{
                x: 0 + offsetX,
                y: 0.75 + offsetY,
                z: -0.4 + offsetZ,
              }}
            />
            {/* <Text
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
        /> */}
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
            {/* <Entity
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
        </Entity> */}
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
              // id="left-hand"
              // oculus-controller
              handTrackingControls={{
                hand: 'left',
                modelColor: '#fbceb1',
              }}
            />
            <Entity
              laserControls={{
                hand: 'left',
              }}
              raycaster={{
                lineColor: '#f59f0a',
              }}
            />
            <Entity
              // oculus-controller
              handTrackingControls={{
                hand: 'right',
                modelColor: '#fbceb1',
              }}
            />
            <Entity
              laserControls={{
                hand: 'right',
              }}
              raycaster={{
                lineColor: '#f59f0a',
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
          </Scene>
        </div>
        <XRToolbar onOpenSheet={() => setIsOpenSheet(true)} />
      </div>
      {isOpenSheet && <SheetSearchContainer onCloseSheet={() => setIsOpenSheet(false)} />}
    </>
  );
};

export default XRSceneContainer;
