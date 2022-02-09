import { Entity, Box } from '@belivvr/aframe-react';
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
          position={{
            x: referencePositionX + wholePositionX,
            y: 0,
            z: 0,
          }}
          // cursor={{
          //   downEvents: ['click'],
          //   mouseCursorStylesEnabled: true,
          //   fuse: false,
          // }}
          key={`${register}-${note}`}
          animation={{
            dur: 1000,
            from: 'white',
            to: 'blue',
            // easing: 'easeInOutSine',
            loop: true,
            startEvents: ['mouseenter'],
            pauseEvents: ['mouseleave'],
            resumeEvents: ['mouseenter'],
            enabled: true,
            type: 'color',
            property: 'material.color',
          }}
          className="raycastable"
        >
          <Box width={bottomWidth} height={0.015} depth={0.045} color="#ffffff" />
          <Box
            width={topWidth}
            height={0.015}
            depth={0.05}
            position={{ x: topPositionX, y: 0, z: -0.0475 }}
            color="#ffffff"
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
