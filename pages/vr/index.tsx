import { Assets, Entity, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import { Entity as AEntity } from 'aframe';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import Piano from '../../components/Piano';
import useMIDI from '../../hooks/useMIDI';

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);
  // const { onOK } = useMIDI();

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
      require('aframe-geometry-merger-component');
      require('aframe-slice9-component');

      if (!AFRAME.components['button-test']) {
        AFRAME.registerComponent('button-test', {
          schema: {},
          init: function () {
            // const onClickTest = (e) => {
            //   console.log({ e });
            //   console.log('test');
            // };
            // TODO: 타입 정의
            // this.el.addEventListener('click', onOK);
            // this.el.addEventListener('mouseenter', () => {
            //   this.el.setAttribute('color', '#F59E0B');
            //   this.el.children[0].setAttribute('color', '#F59E0B');
            //   console.log('마우스 오버됨');
            // });
            // this.el.addEventListener('mouseleave', () => {
            //   this.el.setAttribute('color', '#ffffff');
            //   this.el.children[0].setAttribute('color', '#ffffff');
            //   console.log('마우스 떠남');
            // });
          },
        });
      }

      /**
       * A button with text
       * @namespace ui
       * @component text-button
       */
      if (!AFRAME.components['text-button']) {
        AFRAME.registerComponent<{
          schema: {
            textHoverColor: {
              type: string;
            };
            textColor: {
              type: string;
            };
            backgroundHoverColor: {
              type: string;
            };
            backgroundColor: {
              type: string;
            };
          };
          init(): void;
          play(): void;
          pause(): void;
          update(): void;
          updateButtonState(): void;
          onHover(e: Event | MouseEvent): void;
          onHoverOut(e: Event | MouseEvent): void;
          onClick(e: Event | MouseEvent): void;
          hovering: boolean;
          textEl: AEntity | null;
        }>('text-button', {
          schema: {
            textHoverColor: { type: 'string' },
            textColor: { type: 'string' },
            backgroundHoverColor: { type: 'string' },
            backgroundColor: { type: 'string' },
          },
          init() {
            // TODO: This is a bit of a hack to deal with position "component" not setting matrixNeedsUpdate. Come up with a better solution.
            // this.el.object3D.matrixNeedsUpdate = true;
            this.el.object3D.matrixWorldNeedsUpdate = true;
            console.log('registerComponent');
            // this.onHover = () => {
            // this.hovering = true;
            //   this.updateButtonState();
            // };
            // this.onHoverOut = () => {
            //   this.hovering = false;
            //   this.updateButtonState();
            // };
            // this.el.addEventListener('mouseenter', () => {
            //   console.log('mouseenter');
            // });
            // this.el.addEventListener('mouseleave', () => {
            //   console.log('mouseleave');
            // });
            this.textEl = this.el.querySelector('[text]');
          },
          textEl: null,
          hovering: false,
          play() {
            this.updateButtonState();
            this.el.addEventListener('mouseenter', this.onHover.bind(this));
            this.el.addEventListener('click', this.onClick.bind(this));
            this.el.addEventListener('mouseleave', this.onHoverOut.bind(this));
          },

          pause() {
            this.el.removeEventListener('mouseenter', this.onHover.bind(this));
            this.el.removeEventListener('mouseleave', this.onHoverOut.bind(this));
          },

          update() {
            console.log('니얼굴');
            this.updateButtonState();
          },

          updateButtonState() {
            const hovering = this.hovering;
            this.el.setAttribute(
              'slice9',
              'color',
              hovering ? this.data.backgroundHoverColor : this.data.backgroundColor,
            );

            if (this.textEl) {
              // TODO: 이 부분 체크해야 함
              this.textEl.setAttribute('text', 'color', hovering ? this.data.textHoverColor : this.data.textColor);
            }
          },

          onHover(e) {
            this.hovering = true;
            console.log('호버됨');
            this.updateButtonState();
          },
          onHoverOut(e) {
            this.hovering = false;
            console.log('호버나감');
            this.updateButtonState();
          },
          onClick(e) {
            console.log('클릭');
          },
        });
      }
      // const noop = function () {};
      // // TODO: this should ideally be fixed upstream somehow but its pretty tricky since text is just a geometry not a different type of Object3D, and Object3D is what handles raycast checks.
      // AFRAME.registerComponent('text-raycast-hack', {
      //   dependencies: ['text'],
      //   init() {
      //     this.el.getObject3D('text').raycast = noop;
      //   },
      // });s;
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene
      inspector={{
        url: new URL(
          'https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js',
          // "https://aframe.io/aframe-inspector/dist/aframe-inspector.min.js",
        ),
      }}
      cursor="rayOrigin: mouse; fuse: false"
      raycaster="objects: .raycastable"
      background={{
        transparent: true,
      }}
      stats
    >
      {/* <Entity environment /> */}
      <Entity environment="preset: threetowers; active: true;" />
      <Assets>
        <img id="button" src="/assets/hud/button.9.png" alt="button" />
        <img id="mute_on" src="/assets/hud/mute_on.png" alt="button" />
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
      <Text value="뮤야효" position={{ x: 0, y: 1.5, z: -4 }} />
      {/* <Entity
        position={{
          x: 0,
          y: 1,
          z: 0,
        }}
        mixin="rounded-text-button"
        className="raycastable"
      > */}
      <Text
        position={{
          x: 0,
          y: 1,
          z: 0,
        }}
        align="center"
        value="unmute 니얼굴 실험"
        mixin="rounded-text-button"
        shader="msdf"
        // font="https://raw.githubusercontent.com/myso-kr/aframe-fonts-korean/master/fonts/ofl/nanumgothic/NanumGothic-Regular.json"
        className="raycastable"
        width={2}
      />
      {/* </Entity> */}
      <Plane position={{ x: 0, y: 0, z: 0 }} rotation={{ x: -90, y: 0, z: 0 }} width={1} height={1} color="#7BC8A4" />
      {/* <a-text
        value="Hello, 안녕!"
        color="#FFFFFF"
        shader="msdf"
        font="https://raw.githubusercontent.com/myso-kr/aframe-fonts-korean/master/fonts/ofl/nanumgothic/NanumGothic-Regular.json"
        position="6.7 1 -2"
      ></a-text> */}
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
      {/* <Box
        position={{ x: 0, y: 0.5, z: -1 }}
        width={0.5}
        height={0.5}
        depth={0.5}
        color="#4CC3D9"
        animation__scale={{
          property: 'scale',
          to: '1.2 1.2 1.2',
          dur: 200,
          startEvents: ['mouseenter'],
        }}
        animation__scale__reverse={{
          property: 'scale',
          to: '1 1 1',
          dur: 200,
          startEvents: ['mouseleave'],
        }}
        className="raycastable"
        // clickable
      /> */}
      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
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
        text-button="
                    textHoverColor: #fff;
                    textColor: #fff;
                    backgroundColor: #1da1f2;
                    backgroundHoverColor: #2db1ff;
                    "
        slice9="
                    color: #0F40A9;
                    width: 0.8;
                    height: 0.2;
                    left: 64;
                    top: 64;
                    right: 66;
                    bottom: 66;
                    src: #button"
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
