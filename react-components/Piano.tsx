import { Box, Entity, Plane } from '@belivvr/aframe-react';
import type { PositionProps } from '@belivvr/aframe-react/types/components/position';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IKey } from '@hooks/useKeyParams';
import useStore from '@store/useStore';
import { blackKeyWidth, getKeyX, getRenderInfoByTrackMap, getYForTime, whiteKeyWidth } from '@lib/midi/Render';
import Player from '@lib/midi/Player';
import keyParamsFor88Key from '@lib/midi/keyParams';

export interface PianoProps {
  position: PositionProps;
}

const Piano: FC<PianoProps> = ({ position }) => {
  const [rendered, setRendered] = useState<boolean>(false);
  const { pressedKeys, renderInfoByTrackMap, setRenderInfoByTrackMap } = useStore((state) => state.piano);
  const requestRef = useRef<number | null>(null);

  const buildKey = useCallback((props: IKey) => {
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
          material={{
            shader: 'standard',
          }}
          height={0.025}
          depth={0.07}
          // depth={0.045}
          className={`raycastable piano-key key-${key}`}
        >
          <Box
            width={topWidth}
            height={0.025}
            depth={0.05}
            white-key
            material={{
              shader: 'standard',
            }}
            position={{ x: topPositionX, y: 0, z: -0.0475 }}
            className={`raycastable piano-key key-${key}`}
          />
        </Box>
      );
    } else {
      return (
        <Box
          width={0.014}
          height={0.035}
          depth={0.05}
          position={{
            x: referencePositionX + wholePositionX,
            y: 0.0025,
            z: -0.0475,
          }}
          material={{
            shader: 'standard',
          }}
          color="#000000"
          key={`${register}-${note}`}
          black-key
          className={`raycastable piano-key key-${key}`}
        />
      );
    }
  }, []);

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

  const pianoKeysSelector = useMemo(() => () => document.querySelectorAll('.piano-key'), []);

  useEffect(() => {
    if (rendered) {
      const keys = pianoKeysSelector();
      // const keys = document.querySelectorAll('.piano-key');
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

  const [noteArray, setNoteArray] = useState([1, 2, 3, 4, 5]);

  // getRenderInfoByTrackMap

  function render() {
    if (Player.getInstance().song && !Player.getInstance().paused) {
      // const renderInfoByTrackMap = getRenderInfoByTrackMap(Player.getInstance().getState());
      setRenderInfoByTrackMap(getRenderInfoByTrackMap(Player.getInstance().getState()));

      // console.log({ renderInfoByTrackMap });
    }
    requestRef.current = requestAnimationFrame(render);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current as number);
  }, []);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <>
      <Entity id="piano" position={position}>
        <Plane
          material={{
            color: '#000000',
            shader: 'standard',
            opacity: 0.7,
          }}
          width={1.28}
          height={0.6}
          position={{
            x: 0.083,
            y: 0.2,
            z: -0.3,
          }}
          rotation={{
            x: -45,
            y: 0,
            z: 0,
          }}
        >
          {/* {Array.from(noteArray).map((item, i) => (
            <Box
              key={i}
              position={{
                x: 0.01 + i * 0.04,
                y: 0,
                z: 0,
              }}
              width={0.02}
              height={0.5}
              depth={0.01}
              material={{}}
              className={`note-${i}`}
            />
          ))} */}
          {Object.keys(renderInfoByTrackMap).map((trackIndex) => {
            const whiteNotes = renderInfoByTrackMap[parseInt(trackIndex)].white.map((whiteNote) => {
              // console.log({ x: whiteNote.x, y: whiteNote.y, h: whiteNote.h, i: whiteNote.noteNumber });
              // {x: -0.7525000000000002, y: -277.7876081458332, z: 0.009999999999999787, i: 55}
              return (
                <Box
                  key={whiteNote.noteId}
                  position={{
                    // x: getKeyX(whiteNote.noteNumber),
                    x: whiteNote.x,
                    y: whiteNote.y,
                    // y: 0,
                    z: 0,
                  }}
                  width={whiteKeyWidth}
                  height={whiteNote.h}
                  depth={0.005}
                  material={{
                    color: whiteNote.fillStyle,
                    shader: 'flat',
                  }}
                />
              );
            });

            const blackNotes = renderInfoByTrackMap[parseInt(trackIndex)].black.map((blackNote) => (
              <Box
                key={blackNote.noteId}
                position={{
                  // x: getKeyX(blackNote.noteNumber),
                  x: blackNote.x,
                  // y: blackNote.y,
                  y: blackNote.y,
                  z: 0,
                }}
                width={blackKeyWidth}
                height={blackNote.h}
                depth={0.005}
                material={{
                  color: blackNote.fillStyle,
                  shader: 'flat',
                }}
              />
            ));

            return (
              <>
                {whiteNotes}
                {blackNotes}
              </>
            );
          })}
        </Plane>
        <Box
          material={{
            color: '#000000',
            shader: 'standard',
          }}
          width={1.28}
          height={0.03}
          depth={0.14}
          position={{
            x: 0.083,
            y: -0.02,
            z: -0.03,
          }}
        />
        {keyParamsFor88Key.map((key) => buildKey(key))}
      </Entity>
    </>
  );
};

export default Piano;
