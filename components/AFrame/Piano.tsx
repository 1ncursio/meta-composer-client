import { Box, Entity } from '@belivvr/aframe-react';
import type { PositionProps } from '@belivvr/aframe-react/types/components/position';
import React, { FC, useEffect, useState } from 'react';
import useKeyParams, { IKey } from '../../hooks/useKeyParams';
import useStore from '../../store';

export type PianoProps = {
  position: PositionProps;
};

const Piano: FC<PianoProps> = ({ position }) => {
  const [rendered, setRendered] = useState<boolean>(false);
  const { pressedKeys } = useStore((state) => state.piano);

  const { keyParamsFor88Key } = useKeyParams();

  const buildKey = (props: IKey) => {
    const { register, referencePositionX, topWidth, bottomWidth, topPositionX, wholePositionX, type, note } = props;
    const keyMap = {
      C: 24,
      'C♯': 25,
      D: 26,
      'D♯': 27,
      E: 28,
      F: 29,
      'F♯': 30,
      G: 31,
      'G♯': 32,
      A: 33,
      'A♯': 34,
      B: 35,
    };
    // A0(21)부터 C8(108)까지 있는 키를 생성
    const key = keyMap[note] + (register - 1) * 12;
    if (type === 'white') {
      // let key: number;
      // if ()
      return (
        <Box
          position={{
            x: referencePositionX + wholePositionX,
            y: 0,
            z: 0,
          }}
          key={`${register}-${note}`}
          white-key
          width={bottomWidth}
          height={0.015}
          depth={0.045}
          className={`raycastable piano-key key-${key}`}
        >
          <Box
            width={topWidth}
            height={0.015}
            depth={0.05}
            white-key
            position={{ x: topPositionX, y: 0, z: -0.0475 }}
            className={`raycastable piano-key key-${key}`}
          />
        </Box>
      );
    } else {
      return (
        <Box
          width={0.014}
          height={0.02}
          depth={0.05}
          position={{
            x: referencePositionX + wholePositionX,
            y: 0.0025,
            z: -0.0475,
          }}
          color="#000000"
          key={`${register}-${note}`}
          black-key
          className={`raycastable piano-key key-${key}`}
        />
      );
    }
  };

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
      console.log('AFRAME 있음');
      if (!AFRAME.components['white-key']) {
        AFRAME.registerComponent('white-key', {
          init: function () {
            this.el.addState('white');

            // 키 포지션 애니메이션
            this.el.setAttribute(
              'animation__white-key-down-position',
              'property: object3D.position.y; to: -0.02; dur: 100; startEvents: key-down-position; easing: easeInOutQuad;',
            );
            this.el.setAttribute(
              'animation__white-key-up-position',
              'property: object3D.position.y; to: 0; dur: 100; startEvents: key-up-position; easing: easeInOutQuad;',
            );

            // 키 컬러 애니메이션
            // this.el.setAttribute(
            //   'animation__white-key-down-color',
            //   'property: material.color; to: #F59E0B; dur: 0; startEvents: key-down; easing: easeInOutQuad;',
            // );
            // this.el.setAttribute(
            //   'animation__white-key-up-color',
            //   'property: material.color; to: #ffffff; dur: 0; startEvents: key-up; easing: easeInOutQuad;',
            // );

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

            this.el.addEventListener('key-down-color', () => {
              this.el.setAttribute('color', '#F59E0B');
            });

            this.el.addEventListener('key-up-color', () => {
              this.el.setAttribute('color', '#ffffff');
            });
          },
        });
      }

      if (!AFRAME.components['black-key']) {
        AFRAME.registerComponent('black-key', {
          init: function () {
            this.el.addState('black');

            // 키 포지션 애니메이션
            this.el.setAttribute(
              'animation__black-key-down',
              'property: object3D.position.y; to: 0; dur: 100; startEvents: key-down-position; easing: easeInOutQuad;',
            );
            this.el.setAttribute(
              'animation__black-key-up',
              'property: object3D.position.y; to: 0.0025; dur: 100; startEvents: key-up-position; easing: easeInOutQuad;',
            );

            // 키 컬러 애니메이션
            // this.el.setAttribute(
            //   'animation__white-key-down-color',
            //   'property: material.color; to: #F59E0B; dur: 0; startEvents: key-down; easing: easeInOutQuad;',
            // );
            // this.el.setAttribute(
            //   'animation__white-key-up-color',
            //   'property: material.color; to: #000000; dur: 0; startEvents: key-up; easing: easeInOutQuad;',
            // );

            // this.el.addEventListener('mouseenter', () => {
            //   this.el.setAttribute('color', '#F59E0B');
            //   this.el.children[0].setAttribute('color', '#F59E0B');
            //   console.log('마우스 오버됨');
            // });

            // this.el.addEventListener('mouseleave', () => {
            //   this.el.setAttribute('color', '#000000');
            //   this.el.children[0].setAttribute('color', '#000000');
            //   console.log('마우스 떠남');
            // });

            // this.el.addEventListener('key-down', () => {
            //   console.log('emit test triggered');
            // });
            this.el.addEventListener('key-down-color', () => {
              this.el.setAttribute('color', '#F59E0B');
            });

            this.el.addEventListener('key-up-color', () => {
              this.el.setAttribute('color', '#000000');
            });
          },
        });
      }
    }
  }, [setRendered]);

  useEffect(() => {
    if (rendered) {
      const keys = document.querySelectorAll('.piano-key');
      keys.forEach((el) => {
        let key = '';
        el.classList.forEach((className) => {
          if (className.includes('key-')) {
            key = className.split('key-')[1];
          }
        });

        if (pressedKeys.has(parseInt(key))) {
          // @ts-ignore
          el.emit('key-down-position');
          // @ts-ignore
          el.emit('key-down-color');
        } else {
          // @ts-ignore
          el.emit('key-up-position');
          // @ts-ignore
          el.emit('key-up-color');
        }
      });
    }

    return () => {
      const keys = document.querySelectorAll('.piano-key');
      keys.forEach((el) => {
        // @ts-ignore
        el.emit('key-up-position');
        // @ts-ignore
        el.emit('key-up-color');
      });
    };
  }, [rendered, pressedKeys]);

  if (!rendered) {
    return <>loading</>;
  }

  return <Entity position={position}>{keyParamsFor88Key.map((key) => buildKey(key))}</Entity>;
};

export default Piano;
