import { Assets, Entity, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import Piano from '@components/Piano';
import s from '@utils/s';

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe');
      require('aframe-geometry-merger-component');
      require('aframe-slice9-component');
      require('@components/text-button');
      require('@components/icon-button');
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene
      inspector={{
        url: new URL('https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js'),
      }}
      cursor={s({ rayOrigin: 'mouse', fuse: false })}
      raycaster={s({ objects: '.raycastable' })}
      // background={{
      //   transparent: true,
      // }}
      // stats
    >
      {/* <Entity environment /> */}
      <Entity environment="preset: threetowers; active: true;" />
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
      <Script
        src="https://unpkg.com/aframe-environment-component@1.3.1/dist/aframe-environment-component.min.js"
        strategy="beforeInteractive"
      />
      .
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
      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
      <Sky color="#ECECEC" />
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
    </Scene>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default VRPage;
