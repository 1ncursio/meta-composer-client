import { Box, Entity } from '@belivvr/aframe-react';
import type { PositionProps } from '@belivvr/aframe-react/types/components/position';
import React, { FC, useEffect, useState } from 'react';
import { keyParams } from '../../lib/piano/keyParams';

export type PianoProps = {
  position: PositionProps;
};

const Piano: FC<PianoProps> = ({ position }) => {
  const [rendered, setRendered] = useState<boolean>(false);

  const keyParamsFor88Key = [];
  keyParamsFor88Key.push({
    type: 'white',
    note: 'A',
    topWidth: 0.019,
    bottomWidth: 0.023,
    topPositionX: -0.002,
    wholePositionX: -0.024,
    register: 0,
    referencePositionX: -0.024 * 21,
  });
  keyParamsFor88Key.push(
    ...keyParams.slice(10, 12).map((key) => ({
      ...key,
      register: 0,
      referencePositionX: -0.024 * 21,
    })),
  );
  let referencePositionX = -0.024 * 14;
  for (let register = 1; register <= 7; register++) {
    keyParamsFor88Key.push(
      ...keyParams.map((key) => ({
        ...key,
        register,
        referencePositionX,
      })),
    );
    referencePositionX += 0.024 * 7;
  }
  keyParamsFor88Key.push({
    type: 'white',
    note: 'C',
    topWidth: 0.023,
    bottomWidth: 0.023,
    topPositionX: 0,
    wholePositionX: -0.024 * 6,
    register: 8,
    referencePositionX: 0.84,
  });

  const buildKey = (props) => {
    const { register, referencePositionX, topWidth, bottomWidth, topPositionX, wholePositionX, type, note } = props;
    if (type === 'white') {
      return (
        <Entity
          // geometry={{

          // }}
          position={{
            x: referencePositionX + wholePositionX,
            y: 0,
            z: 0,
          }}
          key={`${register}-${note}`}
          animation__position={{
            property: 'object3D.position.y',
            to: '-0.02',
            dur: 100,
            startEvents: ['mouseenter'],
            easing: 'easeInOutQuad',
          }}
          animation__position__reverse={{
            property: 'object3D.position.y',
            to: '0',
            dur: 100,
            startEvents: ['mouseleave'],
            easing: 'easeInOutQuad',
          }}
        >
          <Box
            width={bottomWidth}
            height={0.015}
            depth={0.045}
            animation__color={{
              property: 'material.color',
              to: '#ff0000',
              dur: 100,
              startEvents: ['mouseenter'],
              easing: 'easeInOutQuad',
            }}
            animation__color__reverse={{
              property: 'material.color',
              to: '#ffffff',
              dur: 100,
              startEvents: ['mouseleave'],
              easing: 'easeInOutQuad',
            }}
            className="raycastable"
          />
          <Box
            width={topWidth}
            height={0.015}
            depth={0.05}
            position={{ x: topPositionX, y: 0, z: -0.0475 }}
            animation__color={{
              property: 'material.color',
              to: '#ff0000',
              dur: 100,
              startEvents: ['mouseenter'],
              easing: 'easeInOutQuad',
            }}
            animation__color__reverse={{
              property: 'material.color',
              to: '#ffffff',
              dur: 100,
              startEvents: ['mouseleave'],
              easing: 'easeInOutQuad',
            }}
            className="raycastable"
          />
        </Entity>
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
          animation__position={{
            property: 'object3D.position.y',
            to: '0',
            dur: 100,
            startEvents: ['mouseenter'],
            easing: 'easeInOutQuad',
          }}
          animation__position__reverse={{
            property: 'object3D.position.y',
            to: '0.0025',
            dur: 100,
            startEvents: ['mouseleave'],
            easing: 'easeInOutQuad',
          }}
          animation__color={{
            property: 'material.color',
            to: '#ff0000',
            dur: 100,
            startEvents: ['mouseenter'],
            easing: 'easeInOutQuad',
          }}
          animation__color__reverse={{
            property: 'material.color',
            to: '#000000',
            dur: 100,
            startEvents: ['mouseleave'],
            easing: 'easeInOutQuad',
          }}
          className="raycastable"
        />
      );
    }
  };

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
    }
  }, [setRendered]);

  if (!rendered) {
    return <>loading</>;
  }

  return <Entity position={position}>{keyParamsFor88Key.map((key) => buildKey(key))}</Entity>;
};

export default Piano;
